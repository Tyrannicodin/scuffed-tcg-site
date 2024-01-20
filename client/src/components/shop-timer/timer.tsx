import React, {useState, useRef, useEffect} from 'react'

export function ShopTimer() {
	function getNextMidnightTime() {
		var midnight = new Date()
		midnight.setUTCHours(24)
		midnight.setUTCMinutes(0)
		midnight.setUTCSeconds(0)
		midnight.setUTCMilliseconds(0)

		return midnight.getTime()
	}

	function getTimeRemaining() {
		const total = getNextMidnightTime() - new Date().getTime()
		const seconds = Math.floor((total / 1000) % 60)
		const minutes = Math.floor((total / 1000 / 60) % 60)
		const hours = Math.floor((total / 1000 / 60 / 60) % 24)
		return {
			seconds,
			minutes,
			hours,
		}
	}

	const timerFormat = () => {
		const {seconds, minutes, hours} = getTimeRemaining()
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const [timer, setTimer] = useState(timerFormat)

	function formatTimer() {
		const {seconds, minutes, hours} = getTimeRemaining()
		setTimer(timerFormat)
	}

	setInterval(() => {
		formatTimer()
	}, 1000)

	return <span>{timer} remaining until reset.</span>
}
