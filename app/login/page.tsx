export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Login</h1>
      <input type="email" placeholder="Enter your email" className="mt-4 p-2 border rounded" />
      <button className="mt-2 p-2 bg-blue-500 text-white rounded">Login</button>
    </div>
  );
}
