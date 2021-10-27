export class PreCacheOperationResult {
  private _succeeded: boolean;

  constructor(succeeded: boolean) {
    this._succeeded = succeeded;
  }

  getSucceeded = (): boolean => this._succeeded;
}

export default PreCacheOperationResult;
