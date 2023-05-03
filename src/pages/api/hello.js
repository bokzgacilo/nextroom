import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  // res.send({ name: 'John Doe' })

  const {data: rooms, error} = await supabase
  .from('rooms')
  .select('*')
  
  if (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while fetching data.' })
  } else {
    res.status(200).json(rooms[0].chats)
  }
  
  // const rooms = await supabase.channel('custom-update-channel')
  // .on(
  //   'postgres_changes',
  //   { event: 'UPDATE', schema: 'public', table: 'rooms' },
  //   (payload) => {
  //     console.log('Change received!', payload)
  //   }
  // )
  // .subscribe()

  // res.send(rooms)
}
