import Image from 'next/image';
import style from './chat.module.css';

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export default function Chat(props) {
  return (
    <div className={style.chat}>
      <div className='avatar'>
        <Image 
          loader={myLoader}
          width={50}
          height={50}
          alt="Sender Avatar" 
          src='https://www.wipo.int/export/sites/www/wipo_magazine/images/en/2018/2018_01_art_7_1_400.jpg' 
        />
      </div>
      <div className={style.details}>
        <h4>{props.sender}</h4>
        <p>{props.message}</p>
      </div>
    </div>
  )
}