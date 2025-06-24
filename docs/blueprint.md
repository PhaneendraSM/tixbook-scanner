# **App Name**: Ticket Validator

## Core Features:

- QR Code Scanner: Utilize device camera for QR code scanning.
- QR Code Decoder: Decode the QR code to extract the ticket ID.
- Ticket Verification: Send a POST request to the API endpoint with the ticket ID to verify the ticket's validity.
- Status Indicator: Display a success message if the ticket is valid and an error message if the ticket is invalid.
- Scan History: Display recent scans with timestamps in a log format.
- Event Details: Display event name/ticket type if provided by the backend in the response.

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) to communicate calm, focus, and accuracy. This color will dominate most of the surfaces in the app.
- Background color: Off-white (#FAFAFA) for a clean and neutral backdrop. Slightly of the same hue as the primary.
- Accent color: Light periwinkle (#CCCCFF), for interactive elements like buttons or highlighted text, creating a point of interest that is neither alarming or distracting.
- Body and headline font: 'Inter' sans-serif for a clean, modern, and highly readable design suitable for both mobile and web.
- Simple and intuitive layout, optimized for mobile screens.
- Use clear and recognizable icons for key actions.
- Subtle animations when scanning and validating tickets.