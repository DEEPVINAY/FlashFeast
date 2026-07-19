# API Documentation

## Endpoints

### Get Menu Items

`GET /menu`

Retrieves a list of all available menu items from the restaurant's menu.

#### Summary
Get menu items

#### Responses

*   **`200 OK`**
    *   **Description:** Successful response. Returns an array of menu item objects.
    *   **Example Body:**
        ```json
        [
          {
            "id": "string",
            "name": "string",
            "category": "string",
            "price": 0.00,
            "available": true
          }
        ]
        ```
        *(Note: The example body structure is illustrative, as no detailed schema was provided in the specification.)*