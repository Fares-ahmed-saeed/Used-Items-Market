
# Local Development Instructions

## Prerequisites
- Node.js 18+ (recommended)
- npm 9+ (recommended)

## Setup Steps

1. Clone the repository
```sh
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```sh
npm install @react-three/fiber@^8.15.16 three@^0.133.0 --legacy-peer-deps
```

3. If you encounter errors with the `lovable-tagger` package, you can safely ignore them as it's only used in the Lovable environment.

4. Start the development server
```sh
npm run dev
```

5. Open your browser at http://localhost:8080

## Troubleshooting

If you encounter errors with `npm install`:
- Try using `npm install --legacy-peer-deps` if there are peer dependency conflicts
- Make sure you have the correct Node.js version (v18+)

If you encounter errors with `npm run dev`:
- Check the console for specific error messages
- Make sure all dependencies were correctly installed
- Try clearing the npm cache with `npm cache clean --force` and reinstalling

## Note
Some features may require backend services that are only available in the Lovable environment. The local development setup is primarily for UI development and testing.
