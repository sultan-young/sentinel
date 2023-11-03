import { ErrorHandler } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { runOutsideAngular } from "./Zone";
import { Severity, extractErrorStack, variableTypeDetection } from "@hpf2e/sentinel-utils";
import { HandleEvents } from "@hpf2e/sentinel-browser";

export class SentinelErrorHandler implements ErrorHandler {
  handleError(error: any) {
    const extractedError = this.extractError(error) || 'Handled unknown error';

   // Capture handled exception and send it to Sentry.
   runOutsideAngular(() => {
    HandleEvents.handleError(extractedError)
   });
  }
  extractError(errorCandidate: any) {
    const error = tryToUnwrapZonejsError(errorCandidate);
  
    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      return extractHttpModuleError(error);
    }
  
    // We can handle messages and Error objects directly.
    if (typeof error === 'string' || isErrorOrErrorLikeObject(error)) {
      return error;
    }
  
    // Nothing was extracted, fallback to default error message.
    return null;
  }
}


// https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
function tryToUnwrapZonejsError(error: unknown): unknown | Error {
  // TODO: once Angular14 is the minimum requirement ERROR_ORIGINAL_ERROR and
  //  getOriginalError from error.ts can be used directly.
  return error && (error as { ngOriginalError: Error }).ngOriginalError
    ? (error as { ngOriginalError: Error }).ngOriginalError
    : error;
}

function extractHttpModuleError(error: HttpErrorResponse): string | Error {
  // The `error` property of http exception can be either an `Error` object, which we can use directly...
  if (isErrorOrErrorLikeObject(error.error)) {
    return error.error;
  }

  // ... or an`ErrorEvent`, which can provide us with the message but no stack...
  if (error.error instanceof ErrorEvent && error.error.message) {
    return error.error.message;
  }

  // ...or the request body itself, which we can use as a message instead.
  if (typeof error.error === 'string') {
    return `Server returned code ${error.status} with body "${error.error}"`;
  }

  // If we don't have any detailed information, fallback to the request message itself.
  return error.message;
}

function isErrorOrErrorLikeObject(value: unknown): value is Error {
  if (value instanceof Error) {
    return true;
  }

  if (value === null || typeof value !== 'object') {
    return false;
  }

  const candidate = value as ErrorCandidate;

  return (
    variableTypeDetection.isString(candidate.name) &&
    variableTypeDetection.isString(candidate.message) &&
    (undefined === candidate.stack || variableTypeDetection.isString(candidate.stack))
  );
}

type ErrorCandidate = {
  name?: unknown;
  message?: unknown;
  stack?: unknown;
};
