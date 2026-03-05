import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { DICTIONARY, PROMT_AI_ROBOT } from './home.component.const';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  aiAnswer: string = 'CLICK THE ROBOT TO TALK TO AI !!!';
  answerStyle: string = '';

  constructor(private route: ActivatedRoute) {}

  talkAI() {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '8946483d757a40c98be33cd155d6a725';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'openai';
    const APP_ID = 'chat-completion';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'gpt-5-nano';
    const MODEL_VERSION_ID = '6e9b0ba78b8e4437a079f8500de64f88';
    const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            text: {
              raw: this.generatePrompt(),
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    this.aiAnswer = 'Waiting for response... Na na na na na BATMAN!';
    this.answerStyle = 'blink';

    fetch(
      'https://api.clarifai.com/v2/models/' +
        MODEL_ID +
        '/versions/' +
        MODEL_VERSION_ID +
        '/outputs',
      requestOptions,
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.aiAnswer = result.outputs[0].data.text.raw.replace(/—/g, '\n');
        this.answerStyle = 'answered';
        console.log(result);
      })
      .catch((error) => console.log('error', error));
  }

  generatePrompt() {
    const index = Math.floor(Math.random() * DICTIONARY.length);

    const promt =
      'Tell a random joke about robots and ' +
      DICTIONARY[index] +
      ' in a friendly way. Add some related emojis at the end of the joke.';

    return promt;
  }
}
