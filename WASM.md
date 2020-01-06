# WebAssembly

## Summary
* Except for the tests, everything seems to work beautifully with just minor changes.
* The testing approach we're using won't work with WebAssembly without some amount of changes as there are new problems, and some benign exceptions are now indistinguishable from problematic ones.
  * We could come up with better mock arguments to functions. This would require changing the C++ SDK to let us create certain things from JavaScript.
  * We could give functions real arguments. This would require initialising most of the SDK for each test, and can't feasibly be done without a convincing browser environment including real WebGL.
  * We could do end-to-end testing instead, as if we're going to have to initialise the SDK, we've got most of an end-to-end test already.
  * We could avoid actually running anything, and parse or use introspection on the WebAssembly and JavaScript to see if the imports and exports match.

## Benefits
* Should give a (potentially significantly) increased framerate.
* Significantly reduces the size of files we need to transfer to the user.
* Should reduce startup time.

## SDK
* Need to build without `-s WASM=0`. There's already an option for this in `master`.
* Need to actually upload the `.wasm` file. This is done in the `wasm` branch.

## wrld.js
### Main stuff
* The WASM build process keeps less RTTI around, so `Module.addFunction` needs a second argument with type information. This is done in the `wasm` branch.

### Tests
* We need to actually download the `.wasm` file. This is done in the `wasm` branch.
* The rest of the tests need rethinking.
  * The tests are only intended to make sure we've exported the necessary functions from Emscripten and imported them into JavaScript successfully, not that they actually do anything sensible.
  * To that end, the functions are called with mocked arguments. This includes things like passing null pointers to functions that don't do null checks before dereferencing them.
  * This used to work because the errors Emscripten would give for problems within C++ code were different to the errors it would give if a function was called from JavaScript that wasn't exported or didn't exist, so we could allow one kind and not the other. C++-based errors were a sign of success as we couldn't hit an error in C++ code unless we'd successfully managed to call some C++ code. (Technically, this wasn't true before the upgrade from Emscripten 1.35 to 1.39.3, as one test was calling a JS function with the wrong number of arguments and still passing, which needed fixing here: https://github.com/wrld3d/wrld.js/pull/70/commits/a3aa490d04b7b39c357259dbeb8587b67af11ca1#diff-350d04e000a20c7442560a94a250550eL63-R95)
  * When targeting WebAssembly instead, the error for a failed vtable lookup (a common symptom when calling a virtual member function of a null object) is the same as the error for JavaScript trying to call a function that wasn't exported or doesn't exist. It's no longer possible to know if it's an issue or the expected benign exception.
  * To resolve this, we'd have to pass real arguments (or more convincing fake ones). This is difficult as we have things like the Emscripten API object pointer, which are normally owned and constructed by the platform object via factories that aren't exported, and can't currently be made any other way. We could:
    * Add a bunch of `extern C`-friendly extra factories for constructing dummy test versions of types. I've not really explored the extent of what would need doing here. We'd basically need to be able to construct a real or stub version of every class that gets used in the functions we're testing, which could be a few classes that can be given stub arguments, or might still end up being a huge chunk of the SDK.
    * Actually get the whole SDK to initialise. This would require either running in a browser, or providing a mock browser environment. The mock browser environment things that look potentially viable all require that the tests are run through Jest, not Jasmine, but they're mostly API compatible, so that aspect isn't a problem. Once we get into mock DOM, mock canvas and mock WebGL working together and connecting them up to Emscripten, though, we start triggering graphics assertions when `glGet`s don't give back exactly what we expect. We could try using real WebGL and canvas implementations for Node, but then we're rapidly approaching where using a real browser would be better. However, the tests would need rewriting for this to work as certain parts are tightly coupled with Node (e.g. importing things - including the Emscripten SDK - with `require`). I've done some extremely basic experimenting with `jest-puppeteer` for from-scratch testing of controlling a browser from a test framework, but haven't got as far as trying to start up wrld.js.
  * Once we're considering redoing things, we might want to discuss end-to-end tests, as if we have to fully initialise the entire SDK to test things, we've nearly got end-to-end testing anyway.
  * There were other issues with the previous testing approach, e.g. sometimes when errors occurred and were silenced, references to parts of previous tests' Emscripten modules would persist after the module got replaced for the next test. This meant that the Emscripten memory buffer wasn't always being freed, and the Javascript heap was filling up after a few tests.
  * Another thing to note is that tools provided by Emscripten like binaryen's `wasm-dis` (also available in JS as a node module) can do things like disassemble a WASM file, letting you grep for functions exported by an Emscripten module (e.g. `(export "setStreamingCompletedCallback" (func $13651))`). Alternatively, we could make Emscripten instantiate (but not run) the module and use introspection to see what's exported. We could potentially combine this with some grepping of the wrld.js source or some introspection to determine if everything we import gets exported, and we might also be able to check types match as this information is in the disassembly, too. Disassembling the `.wasm` file takes a while, though, and we'd potentially be putting a lot of trust into regular expressions to find and extract the information we needed, even if precise formatting changed.