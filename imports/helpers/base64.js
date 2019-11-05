export default function base64(str) {
  const buff = Buffer.from(str, 'utf8');
  return buff.toString('base64');
}
