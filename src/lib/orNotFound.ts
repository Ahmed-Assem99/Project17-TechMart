import { notFound } from "next/navigation";
import { ApiError } from "@/lib/apiError";

// For pages with an id in the URL: the API answers 404 for an id that doesn't exist
// and 400 for one that isn't a valid id. Both mean "this page doesn't exist".
export async function orNotFound<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
}
