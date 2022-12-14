import React from 'react'
import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import './style.css'
import './loader.scss'
import './queries.css'

function App() {
	const [userPrompt, setPrompt] = useState('')
	const [result, setResult] = useState('')
	const [loading, setLoading] = useState(false)
	const [valid, setValid] = useState(false)

	const handleChange = (e) => {
		const text = e.target.value
		setPrompt(text)

		if (!text.trim()) return setValid(false)
		if (!text.match(/^[aA-zZ\s]+$/)) return setValid(false)
		setValid(true)
	}
	const api_key =
		process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY
	const configuration = new Configuration({
		apiKey: api_key,
	})
	const openai = new OpenAIApi(configuration)
	// console.log(api_key)

	const generateImage = async () => {
		setLoading(true)
		const response = await openai.createImage({
			prompt: userPrompt,
			n: 1,
			size: '512x512',
		})
		setLoading(false)
		setResult(response.data.data[0].url)
	}
	return (
		<div className='app-main'>
			{loading ? (
				<>
					<h2>Generating in effect...</h2>
					<div className='spinner'>
						<div className='div'>
							<div></div>
						</div>
						<svg
							className='spinner'
							width='65px'
							height='65px'
							viewBox='0 0 66 66'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle
								className='path'
								fill='none'
								strokeWidth='6'
								strokeLinecap='round'
								cx='33'
								cy='33'
								r='30'
							></circle>
						</svg>
					</div>
				</>
			) : (
				<>
					<h1>Salvador DALL·E</h1>
					<h2>Generate an Image using DALL·E 2 API</h2>
					<textarea
						className='app-input'
						placeholder='bears in space'
						value={userPrompt}
						onChange={handleChange}
						rows='10'
						cols='40'
					/>
					<button className='clay' onClick={generateImage} disabled={!valid}>
						generate an image
						<span type='img' alt='aria-label'>
							{' 🎨'}
						</span>
					</button>
					{result.length > 0 ? (
						<LazyLoadImage
							className='result-image'
							src={result}
							alt='image result'
							effect='blur'
						/>
					) : (
						<></>
					)}
				</>
			)}
		</div>
	)
}

export default App
