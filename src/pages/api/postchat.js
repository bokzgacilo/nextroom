import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const requestData = req.body;


  const {data: rooms, error} = await supabase
  .from('rooms')
  .select('*')
  
  if (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while fetching data.' })
  } else {
    var chats = rooms[0].chats;

    if(chats === null){
      chats = [requestData]
    }else {
      chats.push(requestData)    
    }



    const { newdata, newerror } = await supabase
      .from('rooms')
      .update({ chats: chats })
      .eq('id', 1)
  
      if(newerror){
        console.log(error)
        res.status(500).json({ message: 'An error occurred while updating chat data.' })
      } else {
        res.send(chats)
      }  
    
  }
}
