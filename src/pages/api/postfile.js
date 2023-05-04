import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const requestData = req.body;

  // res.send(requestData)

  const {data: rooms, error} = await supabase
  .from('rooms')
  .select('*')
  
  if (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while fetching data.' })
  } else {
    var files = rooms[0].files;

    if(files === null){
      files = [requestData]
    }else {
      files.push(requestData)    
    }

    const { newdata, newerror } = await supabase
      .from('rooms')
      .update({ files: files })
      .eq('id', 1)
  
      if(newerror){
        console.log(error)
        res.status(500).json({ message: 'An error occurred while updating chat data.' })
      } else {
        res.send(files)
      }  
    
  }
}
