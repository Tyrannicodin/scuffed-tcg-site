/* eslint-disable react/no-unknown-property */
import React from 'react'
import {useRef} from 'react'
import * as three from 'three'
import css from './background.module.scss'
import {PerspectiveCamera} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import cn from 'classnames'

type Props = {
	panorama: string
	camera?: CameraProps
	disabled?: boolean
}

type CameraProps = {
	rotationEnabled?: boolean
	rotationSpeed?: number
	startingRotation?: number
	fov?: number
}

const Panorama = ({panorama, camera, disabled}: Props) => {
	const Camera = ({rotationEnabled, rotationSpeed, startingRotation, fov}: CameraProps) => {
		const cameraRef = useRef<three.PerspectiveCamera>(null)

		useFrame(() => {
			if (!cameraRef.current) return
			if (rotationEnabled === undefined) rotationEnabled = true
			rotationEnabled && (cameraRef.current.rotation.y -= (rotationSpeed || 0.5) / -10000)
		})

		return (
			<PerspectiveCamera
				makeDefault
				ref={cameraRef}
				fov={fov || 75}
				position={[0, 0, 0]}
				rotation={[Math.PI, (startingRotation || 0) * (6.3 / 360), Math.PI]}
			/>
		)
	}

	const Skybox = () => {
		const loader = new three.CubeTextureLoader()
		loader.setPath(`/images/panorama/${panorama}/`)

		/**
		 * Do not adjust the order of the panorama images here!
		 * If the textures aren't lining up, either the panorama was
		 * exported incorrectly, or the starting rotation needs to be adjusted.
		 * It is recommended to use the "Panorama Mod" for Minecraft panoramas.
		 * https://modrinth.com/mod/swd-panorama
		 */
		const texture = loader.load([
			`panorama_1.png`,
			`panorama_3.png`,
			`panorama_5.png`,
			`panorama_4.png`,
			`panorama_0.png`,
			`panorama_2.png`,
		])

		texture.flipY = true

		return (
			<mesh>
				<sphereGeometry />
				<meshBasicMaterial envMap={texture} side={three.BackSide} />
			</mesh>
		)
	}

	if (disabled) return <div className={cn(css.background, css.canvas)} />

	return (
		<Canvas linear flat className={css.canvas}>
			<Skybox />
			<Camera {...camera} />
		</Canvas>
	)
}

export default React.memo(Panorama)
