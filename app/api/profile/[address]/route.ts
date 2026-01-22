import { NextRequest, NextResponse } from "next/server";
import { getUnifiedProfile } from "basecred-sdk";
import { isAddress } from "viem";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid Ethereum address" },
      { status: 400 }
    );
  }

  try {
    const profile = await getUnifiedProfile(address, {
      ethos: {
        baseUrl: "https://api.ethos.network",
        clientId: "basecred-demo@0.1.0",
      },
      talent: {
        baseUrl: "https://api.talentprotocol.com",
        apiKey: process.env.TALENT_API_KEY || "",
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
