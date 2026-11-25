import apiServices from "@/services/apiServices";
import AddressBook from "@/components/addresses/AddressBook";
import RequestError from "@/components/shared/RequestError";
import { toResult } from "@/lib/apiError";

export default async function Addresses() {
  // Runs on the server with the logged-in user's token (see #getToken in apiServices)
  const result = await toResult(apiServices.getAddresses());

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-4 lg:py-12">
      {result.ok ? (
        <AddressBook initialAddresses={result.data.data} />
      ) : (
        <RequestError
          title="We couldn't load your addresses"
          message={result.error.message}
          needsSignIn={result.error.isUnauthorized}
        />
      )}
    </main>
  );
}
