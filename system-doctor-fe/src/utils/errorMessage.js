export const parseErrorMessage = (message) => {
  let parsedError = JSON.parse(message.request.responseText).message
  parsedError = parsedError.replace('ThrottlerException:', '');
  return parsedError;
}