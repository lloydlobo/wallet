/** @source https://github.com/alexnault/classix/blob/main/src/index.ts */

type Argument = string | boolean | null | undefined;

/**
 * Conditionally join classNames into a single string
 * @param {...String} args The expressions to evaluate
 * @returns {String} The joined classNames
 */
function cx(...args: Argument[]): string;

function cx(): string {
  let str = '';
  let i = 0;
  let arg: unknown;

  // rome-ignore lint/style/noArguments: <explanation>
  // rome-ignore lint/style/useWhile: <explanation>
  for (; i < arguments.length; ) {
    // rome-ignore lint/style/noArguments: <explanation>
    // rome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    if ((arg = arguments[i++]) && typeof arg === 'string') {
      // rome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      str && (str += ' ');
      str += arg;
    }
  }
  return str;
}

export { cx };
export default cx;
