export const parseErrorMessage = (message) => {
  const parsedError = JSON.parse(message.request.responseText)
  return parsedError.message;
}