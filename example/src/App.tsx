import React, { useState } from 'react';
import GifPicker, { TenorImage } from '../../.';

const TENOR_API_KEY = 'AIzaSyA0y2NMijXxqwxnk6oWfJiC_usUc8Q4dUA';

function App(): JSX.Element{
	const [ selected, setSelected ] = useState<TenorImage>(null!);

	return (
		<div className="App">
			<h2>Gif Picker React Demo</h2>
			<div className="show-gif">
                Your selected GIF is:
				{selected && (
					<img src={selected.url} className="gif-preview" />
				)}
			</div>

			<GifPicker
				tenorApiKey={TENOR_API_KEY}
				onGifClick={setSelected}
			/>
		</div>
	);
}
export default App;