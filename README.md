# React and CRUD APIs

## Homework

Move the `App` component to its own file and reimport it back into `index.js`.

Listen to this episode of [Syntax](https://syntax.fm/show/751/ui-components-shadcn-tailwind-ui-headless-react-aria-radix-ui), select a modal from one of the UI libraries mentioned and implement it in the project replacing the React Modal currently in use.

## Starter

This is a CRApp (Create React App) project using [JSON Server](https://www.npmjs.com/package/json-server) for the backend.

```sh
npm i
npm i json-server@0.17.4
node server.js
npm run start // NB in a separate terminal tab
```

(Note: we use the last version of json-server before the release of version 1-alpha due to pre-release bugs.)

Test the backend endpoints:

- http://localhost:3001/pets/
- http://localhost:3001/pets/1
- http://localhost:3001/pets/2

Test the frontend endpoint:

- http://localhost:3000/

```js
// import ReactDOM from "react-dom";
...
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
```

## Fetch a List of Data with useEffect and Promises

Use the useEffect hook to kick off the data fetch to the json-server backend, then use Promises to handle the response.

In index.js:

- import the useEffect and useState hooks from React - `import React, { useEffect, useState } from "react";`
- initialize our pets state to an empty array - `const [pets, setPets] = useState([]);`
- useEffect runs after our component renders
- calling setPets is going to trigger a rerender, and we should see our stringified data

```js
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const App = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/pets")
      .then((res) => res.json())
      .then((pets) => setPets(pets));
  }, []);

  return (
    <main>
      <h1>Adopt-a-Pet</h1>
      <pre>{JSON.stringify(pets, null, 2)}</pre>
      <button>Add a Pet</button>
    </main>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
```

## Asnyc Await

`async/await` is a newer method for working with promises - common in both vanilla JavaScript and React apps. If you want to use async/await with useEffect, you need to write an async function and put that _inside_ useEffect function (i.e. do not make the useEffect function itself async).

- create a function inside the useEffect and mark it as `async` - `async function getData() {`
- fetch returns a promise, we can `await` that promise - `const res = await fetch("http://localhost:3001/pets");`
- create a variable called pets and `await` res.json() - `const pets = await res.json();`
- call setPets with the array of pets - `setPets(pets);`

```js
useEffect(() => {
  async function getData() {
    const res = await fetch("http://localhost:3001/pets");
    const pets = await res.json();
    setPets(pets);
  }
  getData();
}, []);
```

## Create a Pet Component

```js
import React from "react";

export const Pet = ({ pet }) => {
  return (
    <div>
      <h2>{JSON.stringify(pet, null, 2)}</h2>
      <h2>{pet.name}</h2>
    </div>
  );
};
```

Import it in index.js and use Array.map() to render pet components:

```js
import { Pet } from "./Pet";
...
return (
    <main>
      <h1>Adopt-a-Pet</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            <Pet pet={pet} />
          </li>
        ))}
      </ul>
      <button>Add a Pet</button>
    </main>
  );
```

## Display a Loading Indicator

We'll add a loading indicator.

Create a new piece of state called loading initialized to value of false

`const [isLoading, setLoading] = useState(false);`

And set loading to true before we start fetching data, and to false after we're done:

```js
useEffect(() => {
  async function getData() {
    setLoading(true);
    const res = await fetch("http://localhost:3001/pets");
    const pets = await res.json();
    setPets(pets);
    setLoading(false);
  }
  getData();
}, []);
```

Use the loading state in the return:

```js
return (
  <main>
    <h1>Adopt-a-Pet</h1>
    {isLoading ? (
      <div className="loading">Loading...</div>
    ) : (
      <>
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <Pet pet={pet} />
            </li>
          ))}
        </ul>
        <button>Add a Pet</button>
      </>
    )}
  </main>
);
```

One problem with our loading indicator is that if fetch or the JSON parsing fails, it's going to throw an error and loading will never be set to false.

With async/await it is common to wrap the function in a `try catch` block so if an error occurs, we catch it (and set loading to false in the catch block).

```js
useEffect(() => {
  async function getData() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/pets");
      const pets = await res.json();
      setPets(pets);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
  getData();
}, []);
```

To see how this might work for promises, comment out the async-await version and use a promise version.

```js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Pet } from "./Pet";
import "./index.css";

const App = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // async function getData() {
    //   setLoading(true);
    //   try {
    //     const res = await fetch(
    //       'http://localhost:3001/pets'
    //     );
    //     const pets = await res.json();
    //     setPets(pets);
    //     setLoading(false);
    //   } catch (e) {
    //     setLoading(false);
    //   }
    // }
    // getData();

    setLoading(true);
    fetch("http://localhost:3001/pets")
      .then((res) => res.json())
      .then((pets) => setPets(pets))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Adopt-a-Pet</h1>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <ul>
            {pets.map((pet) => (
              <li key={pet.id}>
                <Pet pet={pet} />
              </li>
            ))}
          </ul>
          <button>Add a Pet</button>
        </>
      )}
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
```

## Elaborate on the Pets Component

```js
export const Pet = ({ pet, onEdit, onRemove }) => {
  return (
    <div className="pet">
      {pet.photo ? (
        <img src={pet.photo} alt="" className="pet-photo sm" />
      ) : (
        <div className="no-photo">?</div>
      )}
      <button className="pet-name" onClick={onEdit}>
        {pet.name}
      </button>
      <div className="pet-kind">{pet.kind}</div>

      <button className="adopt-btn" onClick={onRemove}>
        <span role="img" aria-label="adopt this pet">
          🏠
        </span>
      </button>
    </div>
  );
};
```

We are already using the pet prop - `{ pet, onEdit, onRemove }` - onEdit and onRemove are for functions that we will write later.

## Using React Utilities: react-modal

When we click the Add a Pet button, we'll open a [React modal](https://www.npmjs.com/package/react-modal) with a form that will let the user create a new pet.

```sh
npm i react-modal
```

- import it as Modal in index.js: `import Modal from 'react-modal';`
- add it before the close of the main element in `index.js`:

```js
<main>
  ...
  <Modal isOpen={isNewPetOpen}>hello</Modal>
</main>
```

The modal requires a prop to tell it whether to display or not.

We'll add state in index.js:

```js
const [isNewPetOpen, setNewPetOpen] = useState(false);
```

When we click the add a pet button we want to toggle that state to true. Add an onClick event to the button and pass a function to call setNewPetOpen to true.

```js
<>
  <ul>
    {pets.map((pet) => (
      <li key={pet.id}>
        <Pet pet={pet} />
      </li>
    ))}
  </ul>
  <button onClick={() => setNewPetOpen(true)}>Add a Pet</button>
</>
```

Note: instead of creating a standalone function we create a function in the curly braces. This is just a stylistic choice. I.e. - we _don't_ do this:

```js
function closeModal() {
  setNewPetOpen(false);
}
...
<Modal isOpen={isNewPetOpen} onRequestClose={closeModal}>
```

Now when we click the button the modal shows up, but we have no way to close it.

Pass another prop to the modal called onRequestClose with a function that will call setNewPetOpen to false.

```js
<Modal isOpen={isNewPetOpen} onRequestClose={() => setNewPetOpen(false)}>
  hello
</Modal>
```

Note the [React Modal](https://www.npmjs.com/package/react-modal) error in the console.

`Modal.setAppElement("#root" );`

or:

```js
const container = document.getElementById("app");
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);
```

## Create a New Pet Form

We need a form to input the pet's data inside the modal dialog.

Create `NewPetModal.js` in `src`:

```js
import React from "react";
import Modal from "react-modal";

const NewPetModal = () => {
  return (
    <Modal isOpen={true}>
      <h2>New Pet</h2>
    </Modal>
  );
};
export default NewPetModal;
```

Import and use it in `index.js`:

```js
import NewPetModal from './NewPetModal';

...
<main>
...
  {isNewPetOpen && (
    <NewPetModal
      isOpen={isNewPetOpen}
      onCancel={() => setNewPetOpen(false)}
    />
  )}
</main>
```

We are using the [Logical AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) operator here. This is often used instead of a ternary expression when there is only one result (a boolean true or false).

we can now destructure the onCancel prop and use it in our modal:

```js
import React from "react";
import Modal from "react-modal";

const NewPetModal = ({ onCancel }) => {
  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>New Pet</h2>
    </Modal>
  );
};
export default NewPetModal;
```

Add the form and state to NewPetModal:

```js
import { useState } from "react";
import Modal from "react-modal";

const NewPetModal = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("");

  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>New Pet</h2>
      <form className="pet-form">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="kind">Kind</label>
        <select
          name="kind"
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Choose a kind</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};

export default NewPetModal;
```

Note: you can enter details but the submit button just refreshes the page (the default action for forms).

## Add a Photo

In order to [upload files](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) we use `<input type='file' />`. The selected files' are returned by the element's HTMLInputElement.files property, which is a FileList object containing a list of File objects. The FileList behaves like an array, so you can check its length property to get the number of selected files.

To be able to get the selected file out of an input we must to use a [ref](https://react.dev/reference/react/useRef) because file inputs can't be [controlled inputs](https://reactjs.org/docs/forms.html). File uploads must be [uncontrolled inputs](https://reactjs.org/docs/uncontrolled-components.html).

`useRef` returns an object with a single `current` property.

Here is a simple [introduction to React's useRef hook](https://medium.com/technofunnel/react-uncontrolled-elements-with-useref-hooks-9c5873476c6f).

Compare React's implementation of a file upload with [standard HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) file uploads on MDN.

In NewPetModal - import `useRef` and set up state.

```js
import React, { useState, useRef } from "react";
import Modal from "react-modal";

const NewPetModal = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("");
  const [photo, setPhoto] = useState(null);
  const photoInput = useRef();

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>New Pet</h2>
      <form className="pet-form">
        {photo && <img alt="the pet" src={photo} />}
        <label htmlFor="photo">Photo</label>
        <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="kind">Kind</label>
        <select
          name="kind"
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Choose a kind</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};

export default NewPetModal;
```

Note the select element. In standard HTML forms a

```html
<select></select>
```

creates a drop-down list and the [selected option is marked](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) using `selected`.

React selects use a [value attribute](https://reactjs.org/docs/forms.html#the-select-tag) on the select tag instead.

Note also the [`FileReader`API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). This lets web apps read the contents of files stored on the user's computer.

The [readAsDataURL method](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) of the `FileReader` API starts reading the contents of the specified blob. Once finished, the result attribute contains a [`data: URL`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) representing the file's data.

We are using the method above for testing. Normally (and as you shall see in the next exercise) you would upload the file to a server.

## Implement Saving Pet Data Locally

The New Pet form currently doesn't do anything when you click Save, so we'll add a pet to our locally stored list of pets in index's state. This will lay the groundwork for making API calls to the server which will permanently store the pet in our db.

Add an onSubmit handler to our form to intercept the submit event:

```js
const submit = (event) => {
  event.preventDefault();
  onSave({
    name,
    kind,
    photo,
  });
};
```

We'll call it from the form:

`<form className="pet-form" onSubmit={submit}>`

```js
import React, { useState, useRef } from "react";
import Modal from "react-modal";

const NewPetModal = ({ onCancel, onSave }) => {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("");
  const [photo, setPhoto] = useState(null);
  const photoInput = useRef();

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    onSave({
      name,
      kind,
      photo,
    });
  };
  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>New Pet</h2>
      <form className="pet-form" onSubmit={submit}>
        {photo && <img alt="the pet" src={photo} />}
        <label htmlFor="photo">Photo</label>
        <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="kind">Kind</label>
        <select
          name="kind"
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Choose a kind</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};

export default NewPetModal;
```

Create addPet in index.js

```js
const addPet = async ({ name, kind, photo }) => {
  setPets([
    ...pets,
    {
      id: Math.random(),
      name,
      kind,
      photo,
    },
  ]);
  setNewPetOpen(false);
};
```

And pass it as a prop - onSave - into the modal from index.js

```js
  {isNewPetOpen && (
    <NewPetModal
      onCancel={() => setNewPetOpen(false)}
      onSave={addPet}
    />
  )}
</main>
```

Destructure the onSave prop in NewPetModal `const NewPetModal = ({ onCancel, onSave }) => {`

Test adding a pet. The pet is saved to local state only, refreshing will cause the new pet to disappear

## Use HTTP POST to Save the Pet to the Server

The app is currently saving the pet locally, but it's not persisted to the server.

We'll add an HTTP POST call to save the pet data and refresh the list. We'll also implement a saving state to disable the buttons while the save is underway and display any errors that the server returns.

To help keep the amount of code in our index.js file managable, we'll use an separate file for our api calls.

Create a new `api.js` file in src:

```js
export const listPets = () => {
  return fetch("http://localhost:3001/pets").then((res) => res.json());
};

export const createPet = (pet) => {
  return fetch("http://localhost:3001/pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  }).then((res) => res.json());
};
```

index.js:

```js
import { listPets, createPet } from './api';
...
useEffect(() => {
  setLoading(true);
  listPets()
    .then((pets) => setPets(pets))
    .finally(() => setLoading(false));
}, []);
```

Add error handling to the api code:

```js
const handleErrors = (res) => {
  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res;
};

export const listPets = () => {
  return fetch("http://localhost:3001/pets").then((res) => res.json());
};

export const createPet = (pet) => {
  return fetch("http://localhost:3001/pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  })
    .then(handleErrors)
    .then((res) => res.json());
};
```

Edit the addPet function in index.js to use the exported createPet function in our API:

```js
const addPet = async (pet) => {
  return createPet(pet).then((newPet) => {
    setPets([...pets, newPet]);
    setNewPetOpen(false);
  });
};
```

Testing the add pet form now saves the pet to the db.

Note: possible server error - cannot find module encodings.

- Stop the server and npm install json-server
- restart the server

Test submitting the form with a blank pet and note the server is returning useful errors to the browser's console:

`{name: "Name can't be blank", kind: "Kind must be 'cat' or 'dog'"}`

We'll catch and display the errors in NewPetModal.js

```js
const [errors, setErrors] = useState(null);
...
const submit = (event) => {
  event.preventDefault();
  onSave({
    name,
    kind,
    photo,
  }).catch((error) => {
    console.log(error);
    setErrors(error);
  });
};
```

Now that we have the errors in local state, we can display them in the form beneath the name and type fields (photos are optional so we need not display errors there):

```js
<input
  type="text"
  id="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>;
{errors && errors.name && <div className="error">{errors.name}</div>}
...
</select>
{errors && errors.kind && (
  <div className="error">{errors.kind}</div>
)}
```

Here's the complete Modal:

```js
<Modal isOpen={true} onRequestClose={onCancel}>
  <h2>New Pet</h2>
  <form className="pet-form" onSubmit={submit}>
    {photo && <img alt="the pet" src={photo} />}
    <label htmlFor="photo">Photo</label>
    <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
    <label htmlFor="name">Name</label>
    <input
      type="text"
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    {errors && errors.name && <div className="error">{errors.name}</div>}
    <label htmlFor="kind">Kind</label>
    <select
      name="kind"
      id="kind"
      value={kind}
      onChange={(e) => setKind(e.target.value)}
    >
      <option value="">Choose a kind</option>
      <option value="cat">Cat</option>
      <option value="dog">Dog</option>
    </select>
    {errors && errors.kind && <div className="error">{errors.kind}</div>}
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
    <button type="submit">Save</button>
  </form>
</Modal>
```

Now we'll disable the form while its being submitted.

In NewPetModal:

```js
const [saving, setSaving] = useState(false);
...
const submit = event => {
    event.preventDefault();
    setSaving(true);
    onSave({
      name,
      kind,
      photo
    }).catch(error => {
      console.log(error);
      setErrors(error);
      setSaving(false);
    });
  };
```

Disable the buttons while saving is true:

```js
<button
  disabled={saving}
  type="button"
  onClick={onCancel}
>
  Cancel
</button>
<button
  disabled={saving}
  type="submit">
  Save
</button>
```

Test with valid inputs.

Note: I have added a slight delay to the backend server to help emulate real world conditions:

```js
server.use(pause(350));
```

Set the value higher if you want to increase the amount of time for the loading and saving states.

## Use HTTP PUT to Update the Pet on the Server

We want to be able to click on a pet to edit its details.

To do this we'll create a new modal component with a form for editing a pet.

We're going to need:

- a dialogue for being able to edit the pet
- some state to control whether that dialogue is open or not
- a new API call to be able to save that pet to the server

Add a new piece of state in App (index.js) that will store the current pet:

<!-- // here -->

```js
const [currentPet, setCurrentPet] = useState(null);
```

This piece of state can serve to

- store the pet we clicked on, and,
- control whether or not the modal is displayed.

Note that the Pet component is expecting an onEdit prop that will run when the pet is clicked on.

Pass an onEdit function to the pet component:

```js
<Pet
  pet={pet}
  onEdit={() => {
    console.log("pet", pet);
    setCurrentPet(pet);
  }}
/>
```

Clicking on the _pet name_ should set the currentPet and log it to the console.

Create `EditPetModal.js` in src and copy and paste the contents of NewPetModal into it.

The form is going to be very similar to NewPetModal, but there's a couple differences.

We want to initialize the name, kind and photo states to whatever pet is passed in.

```js
const [name, setName] = useState(pet.name);
const [kind, setKind] = useState(pet.kind);
const [photo, setPhoto] = useState(pet.photo);
```

And accept a pet prop `const EditPetModal = ({ pet, onCancel, onSave }) =>` and edit the submit function to spread the pet's values into the object before adding any changed values. Without this we would not get the pet's id (which we are not changing).

```js
import { useState, useRef } from "react";
import Modal from "react-modal";

const EditPetModal = ({ pet, onCancel, onSave }) => {
  // NEW
  const [name, setName] = useState(pet.name);
  const [kind, setKind] = useState(pet.kind);
  const [photo, setPhoto] = useState(pet.photo);

  const [errors, setErrors] = useState(null);
  const [saving, setSaving] = useState(false);
  const photoInput = useRef();

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  //NEW
  const submit = (event) => {
    event.preventDefault();
    setSaving(true);
    onSave({
      ...pet, // id!
      name,
      kind,
      photo,
    }).catch((error) => {
      console.log(error);
      setErrors(error);
      setSaving(false);
    });
  };

  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>Edit Pet</h2>

      <form className="pet-form" onSubmit={submit}>
        {photo && <img alt="the pet" src={photo} />}
        <label htmlFor="photo">Photo</label>
        <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors && errors.name && <div className="error">{errors.name}</div>}
        <label htmlFor="kind">Kind</label>
        <select
          name="kind"
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Choose a kind</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
        {errors && errors.kind && <div className="error">{errors.kind}</div>}
        <button disabled={saving} type="button" onClick={onCancel}>
          Cancel
        </button>
        <button disabled={saving} type="submit">
          Save
        </button>
      </form>
    </Modal>
  );
};

export default EditPetModal;
```

Go back to our index file and import editPetModal:

`import EditPetModal from './EditPetModal';`

and render the editPet modal at the bottom beneath the NewPetModal:

```js
  {isNewPetOpen && (
    <NewPetModal
      onCancel={() => setNewPetOpen(false)}
      onSave={addPet}
    />
  )}
  {currentPet && (
    <EditPetModal
      pet={currentPet}
      onCancel={() => setCurrentPet(null)}
      onSave={savePet}
    />
  )}
</main>
```

Add a savePet function in index.js:

```js
const savePet = async (pet) => {
  console.log(" editing a pet ", pet);
  // api call goes here
};
```

Test by clicking on a pet, changing a value and examining the console.

We'll need an `update` function in our api.js:

`import { listPets, createPet, updatePet } from './api';`

Then in api.js:

```js
export const updatePet = (pet) => {
  console.log(pet);
  return fetch(`http://localhost:3001/pets/${pet.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pet),
  })
    .then(handleErrors)
    .then((res) => res.json());
};
```

Back in index:

```js
const savePet = async (pet) => {
  return updatePet(pet).then((updatedPet) => {
    setPets((pets) =>
      pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    setCurrentPet(null);
  });
};
```

We can now edit a pet.

## Use HTTP DELETE to Remove a Pet from the Server

When you click the 'house' button that is displayed when hovering over a pet it should remove the pet from the list.

api.js:

```js
export const deletePet = (pet) => {
  return fetch(`http://localhost:3001/pets/${pet.id}`, {
    method: "DELETE",
  })
    .then(handleErrors)
    .then((res) => res.json());
};
```

In index file, import this delete pet function.

```js
import { listPets, createPet, updatePet, deletePet } from "./api";
```

And wire up a handler for the home button to call our delete pet API.

The Pet component should be passed an `onRemove` prop: `const Pet = ({ pet, onEdit, onRemove }) => {`

In index, we pass a prop to Pet called onRemove.

```js
<Pet
  pet={pet}
  onRemove={() => removePet(pet)}
  onEdit={() => {
    setCurrentPet(pet);
  }}
/>
```

When that's called, we want to do a little bit of work before we call our delete function.

Make a function called removePet that uses the browser's confirm dialog to make sure that the user actually wants to remove this pet.

If the result is true we'll call our delete pet API, and pass in the pet

```js
const removePet = (byePet) => {
  const result = window.confirm(
    `Are you sure you want to adopt ${byePet.name}`
  );
  if (result) {
    deletePet(byePet).then(() => {
      setPets((pets) => pets.filter((pet) => pet.id !== byePet.id));
    });
  }
};
```

In the Pet component note that the 'home' icon/button has a onClick event listener that will run the onRemove function:

```js
<button className="adopt-btn" onClick={onRemove}>
  <span role="img" aria-label="adopt this pet">
    🏠
  </span>
</button>
```

## Refactor New and Edit Forms into a Single file

The "New Pet" and "Edit Pet" forms are very similar, so we'll refactor them into a single form component and DRY up the code.

The only real difference between our two forms are the h2 headings and how the state is initialized.

We'll retain the `EditPetModal` and `NewPetModal` files since they return a modal but we'll use the same form for both.

- make a file called `PetForm.js`, import React and create a component

Copy the _form only_ from edit pet modal:

```js
const PetForm = () => {
  return (
    <form className="pet-form" onSubmit={submit}>
      {photo && <img alt="the pet" src={photo} />}
      <label htmlFor="photo">Photo</label>
      <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors && errors.name && <div className="error">{errors.name}</div>}
      <label htmlFor="kind">Kind</label>
      <select
        name="kind"
        id="kind"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        <option value="">Choose a kind</option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </select>
      {errors && errors.kind && <div className="error">{errors.kind}</div>}
      <button disabled={saving} type="button" onClick={onCancel}>
        Cancel
      </button>
      <button disabled={saving} type="submit">
        Save
      </button>
    </form>
  );
};
export default PetForm;
```

Handle the case when pet is undefined in PetForm by creating an `initialPet` object that will be used in the event that there is no pet prop.

```js
const PetForm = ({ pet, onSave, onCancel }) => {
  const initialPet = pet || {
    name: '',
    kind: '',
    photo: null
  };
  const [name, setName] = useState(initialPet.name);
  const [kind, setKind] = useState(initialPet.kind);
  const [photo, setPhoto] = useState(initialPet.photo);
```

Add the react hooks and the necessary updatePhoto and submit functions:

```js
import { useState, useRef } from "react";

const PetForm = ({ pet, onSave, onCancel }) => {
  const initialPet = pet || {
    name: "",
    kind: "",
    photo: null,
  };
  const [name, setName] = useState(initialPet.name);
  const [kind, setKind] = useState(initialPet.kind);
  const [photo, setPhoto] = useState(initialPet.photo);
  const [errors, setErrors] = useState(null);
  const [saving, setSaving] = useState(false);
  const photoInput = useRef();

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setSaving(true);
    onSave({
      ...pet,
      name,
      kind,
      photo,
    }).catch((error) => {
      console.log(error);
      setErrors(error);
      setSaving(false);
    });
  };

  return (
    <form className="pet-form" onSubmit={submit}>
      {photo && <img alt="the pet" src={photo} />}
      <label htmlFor="photo">Photo</label>
      <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors && errors.name && <div className="error">{errors.name}</div>}
      <label htmlFor="kind">Kind</label>
      <select
        name="kind"
        id="kind"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        <option value="">Choose a kind</option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </select>
      {errors && errors.kind && <div className="error">{errors.kind}</div>}
      <button disabled={saving} type="button" onClick={onCancel}>
        Cancel
      </button>
      <button disabled={saving} type="submit">
        Save
      </button>
    </form>
  );
};

export default PetForm;
```

Now we can edit the two modals to import and use the unified form.

EditPetModal.js:

```js
import Modal from "react-modal";
import PetForm from "./PetForm";

const EditPetModal = ({ pet, onCancel, onSave }) => {
  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>Edit Pet</h2>
      <PetForm pet={pet} onCancel={onCancel} onSave={onSave} />
    </Modal>
  );
};

export default EditPetModal;
```

Test editing a pet.

NewPetModal.js:

```js
import Modal from "react-modal";
import PetForm from "./PetForm";

const NewPetModal = ({ onCancel, onSave }) => {
  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>New Pet</h2>
      <PetForm onCancel={onCancel} onSave={onSave} />
    </Modal>
  );
};

export default NewPetModal;
```

Test adding a pet.

The full PetForm:

```js
import React, { useState, useRef } from "react";

const PetForm = ({ pet, onSave, onCancel }) => {
  const initialPet = pet || {
    name: "",
    kind: "",
    photo: null,
  };
  const [name, setName] = useState(initialPet.name);
  const [kind, setKind] = useState(initialPet.kind);
  const [photo, setPhoto] = useState(initialPet.photo);
  const [errors, setErrors] = useState(null);
  const [saving, setSaving] = useState(false);
  const photoInput = useRef();

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setSaving(true);
    onSave({
      ...pet,
      name,
      kind,
      photo,
    }).catch((error) => {
      console.log(error);
      setErrors(error);
      setSaving(false);
    });
  };

  return (
    <form className="pet-form" onSubmit={submit}>
      {photo && <img alt="the pet" src={photo} />}
      <label htmlFor="photo">Photo</label>
      <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors && errors.name && <div className="error">{errors.name}</div>}
      <label htmlFor="kind">Kind</label>
      <select
        name="kind"
        id="kind"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        <option value="">Choose a kind</option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </select>
      {errors && errors.kind && <div className="error">{errors.kind}</div>}
      <button disabled={saving} type="button" onClick={onCancel}>
        Cancel
      </button>
      <button disabled={saving} type="submit">
        Save
      </button>
    </form>
  );
};

export default PetForm;
```

## Notes

Use/demo Postman or Insomnia?
