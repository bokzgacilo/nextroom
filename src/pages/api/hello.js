// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var db = new sqlite3.Database('../database/user.db');

export default function handler(req, res) {
  res.send({ name: 'John Doe' })
}
