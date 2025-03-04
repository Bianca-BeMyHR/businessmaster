import Link from 'next/link';

export default function PaymentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h2 className="text-2xl font-bold mb-6">Payment Instructions</h2>

      <div className="w-full max-w-lg p-6 bg-white border rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">
          You are about to make a payment using the Helcim platform. Please follow the instructions below to complete the transaction:
        </p>
        
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Click on the link below to proceed to the Helcim payment gateway.</li>
          <li>Ensure that all payment details are correct before submitting the payment.</li>
          <li>If you face any issues, please contact our support team.</li>
        </ul>

        <Link href="https://bemyhr.myhelcim.com/hosted/?token=3d3f3a95ee4e9920a7f032&amount=400.00&amountHash=9c2fc73bdcb5b0ce9e2273bb82708f032f69df9093fae520cdc15c0e02df3bfa" className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center">
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
}

