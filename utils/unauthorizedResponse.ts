import { NextResponse } from "next/server";
import { z } from "zod";

// Helper functions
export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  function serverError(message: string) {
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
  
  function handleError(error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }