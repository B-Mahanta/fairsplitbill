import { ViteReactSSG } from 'vite-react-ssg';
console.log('Length:', ViteReactSSG.length);
console.log('String:', ViteReactSSG.toString().substring(0, 100)); // First 100 chars
// Try to call it with empty object to see error?
try {
    ViteReactSSG({});
} catch (e) {
    console.log('Error calling with obj:', e.message);
}
