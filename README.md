# Image Upload API

This is a Node.js API that allows you to upload images to Cloudinary.

## Prerequisites

- Node.js installed
- Cloudinary credentials (already configured in `.env`)

## Installation

1.  Open a terminal in the project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

1.  **Start the Server:**

    ```bash
    node server.js
    ```

    The server will run on `http://localhost:3001`.

2.  **Upload an Image (Browser):**

    - Open `http://localhost:3001` in your browser.
    - Click "Click to select an image" and choose a file.
    - Click "Upload Image".
    - The Cloudinary URL will be displayed upon success.

3.  **Upload an Image (API):**

    - **Endpoint:** `POST /upload`
    - **Body:** `form-data`
      - Key: `image`
      - Value: [Select an image file]

    **Example Response:**

    ```json
    {
      "message": "Image uploaded successfully",
      "url": "https://res.cloudinary.com/...",
      "public_id": "zeroup_uploads/..."
    }
    ```

## Testing

You can use Postman, Insomnia, or curl to test the API.

**Curl Example:**

```bash
curl -F "image=@/path/to/your/image.jpg" http://localhost:3001/upload
```
