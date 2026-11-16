import apiServices from "@/services/apiServices";
import AddressBook from "@/components/addresses/AddressBook";

export default async function Addresses() {
  // Runs on the server with the logged-in user's token (see #getHeaders in apiServices)
  const response = await apiServices.getAddresses();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-4 lg:py-12">
      {/* ?? []: if the request failed there's no data, so start with an empty list */}
      <AddressBook initialAddresses={response.data ?? []} />
    </main>
  );
}
