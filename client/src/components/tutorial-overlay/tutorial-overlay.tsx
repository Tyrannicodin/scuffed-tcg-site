import {useEffect, useState} from 'react'
import css from './tutorial-overlay.module.scss'

export function TutorialOverlay() {
	useEffect(() => {
		function handleResize() {
            const loginElement = document.getElementById('login')?.getBoundingClientRect()
            setTargetRect(loginElement ? loginElement : null)
		}
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])
    
	const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
	if (!targetRect) return <></>

	return (
		<div>
			<div className={css.overlay} style={{left: 0, width: targetRect.left}}></div>
			<div className={css.overlay} style={{right: 0, width: targetRect.left}}></div>
			<div
				className={css.overlay}
				style={{
					top: 0,
					height: targetRect.y,
					left: targetRect.x,
					width: targetRect.width,
				}}
			></div>
			<div
				className={css.overlay}
				style={{
					bottom: 0,
					top: targetRect.bottom,
					left: targetRect.x,
					width: targetRect.width,
				}}
			></div>
		</div>
	)
}
