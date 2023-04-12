import {basicSetup, EditorView} from "codemirror"
import {keymap} from "@codemirror/view"
import {dracula} from "thememirror"
var codeLang = "Javascript";
var userLang = "Python";
var sysPromptMain = `You are a code AI assistant, CodeGPT. The user will give you code and you will change that code using these guidelines:
1. If you see text enclosed with [] inside a comment, replace the comment with code following the text.
2. The user is programming in ` + codeLang + " but has a mostly " + userLang + " background. Replace " + userLang + " functions with " + codeLang + ` ones, and fix syntax issues.
Send the modified code to the user in plaintext without any additional information or explanation (unless it is in comments.) Do not put it in a codeblock. If you fundamentally cannot follow the user's instructions, *then* you can explain why you can't.`;

var sysPromptAlt = `You are a code AI assistant, CodeGPT. The user will give you code and you will change that code using these guidelines:
1. If you see text enclosed with [] inside a comment, replace the comment with code following the text.
2. The user is programming in ` + codeLang + `. Fix any syntax issues or other errors.
Send the modified code to the user in plaintext without any additional information or explanation (unless it is in comments.) Do not put it in a codeblock. If you fundamentally cannot follow the user's instructions, *then* you can explain why you can't.`;


function feedToGPT(view) {
  console.log(view.state.doc.toString());
	const thingy = '{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":' + JSON.stringify(sysPromptMain) + '},{"role":"user","content":' + JSON.stringify(view.state.doc.toString()) + '}]}'
	console.log(thingy)
	gpt(userKey, thingy)
	.then((text) => {
    // handle the plaintext result here
    console.log(JSON.stringify(text));
		const transaction = view.state.update({ // create a new transaction
    changes: { // set the entire file content to "Hello world"
      from: 0,
      to: view.state.doc.length,
      insert: text.choices[0].message.content
    }
  });
  view.dispatch(transaction); // apply the transaction to the view
	});
}

var editorview = new EditorView({
  doc: "",
  extensions: [
    keymap.of([{key: "Alt-l", run: feedToGPT}]),
    basicSetup,
    dracula
  ],
  parent: document.body
})

var userKey = prompt("Api key:");

async function gpt(apiKey, msgs) {
	const response = await fetch("https://api.openai.com/v1/chat/completions", {
    "credentials": "omit",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
    },
    "referrer": "https://CuddlyMicroRectangle.iamsirsammy.repl.co",
    "body": msgs,
    "method": "POST",
    "mode": "cors",
});
	const text = await response.json();
  return text;
}