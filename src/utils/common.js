export default function checkInputAvailable(input) {
  const answer = (input || '').trim();
  return answer && answer !== '' && answer.length > 0;
}