import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const {data: rooms, error} = await supabase
  .from('rooms')
  .select('*')
  
  if (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while fetching data.' })
  } else {
    res.status(200).json(rooms[0].files)
  }
}
