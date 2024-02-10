# Builder Demo

A drag-and-drop block-based AI model builder demo that uses TensorFlow for the training.

## Frontend

* Svelte/SvelteKit
* Tailwind CSS
* daisyUI
* svelte-dnd-action

To install required dependencies:

```bash
cd frontend
npm install
```

To test it out:

```bash
npm run dev
```

## Backend

* Python
* FastAPI
* TensorFlow

To install required dependencies:

```bash
pip install fastapi "uvicorn[standard]" gunicorn tensorflow
```

To test it out:

```bash
uvicorn main:app --reload
```

## About

Created September 2, 2023
