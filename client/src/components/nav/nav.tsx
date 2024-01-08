import { useState } from 'react';
import css from './nav.module.css'


type Props = {
    elements: Array<string>
}

export default function NavBar({elements}: Props) {
    const [isShown, setIsShown] = useState(false);

    return (
        <ul onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} style={{"width": isShown ? "20%" : "5%"}} className={css.navList}>{elements.map((element) => <li className={css.navItem}>{element}</li>)}</ul>
    )
}