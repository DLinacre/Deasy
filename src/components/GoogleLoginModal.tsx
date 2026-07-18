import React, { useState } from "react";
import { Shield, Lock, CheckCircle, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { GoogleProfile } from "../types";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: GoogleProfile) => void;
  defaultEmail?: string;
}

export default function GoogleLoginModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEmail = "www.Linacre.site",
}: GoogleLoginModalProps) {
  const [step, setStep] = useState<"accounts" | "consent" | "handshake">("accounts");
  const [selectedEmail, setSelectedEmail] = useState(defaultEmail);
  const [customEmail, setCustomEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (email: string) => {
    setSelectedEmail(email);
    setStep("consent");
  };

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.includes("@") || customEmail.includes("Linacre")) {
      setSelectedEmail(customEmail);
      setStep("consent");
    } else {
      alert("Please enter a valid account identifier.");
    }
  };

  const handleConsentApproved = () => {
    setStep("handshake");
    setIsConnecting(true);
    
    // Simulate OAuth 2.0 handshake delay
    setTimeout(() => {
      setIsConnecting(false);
      const name = selectedEmail.split("@")[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      const profile: GoogleProfile = {
        email: selectedEmail,
        name: displayName,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        connectedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        scopes: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/drive.appdata",
        ],
      };
      
      onSuccess(profile);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Outer Google Container */}
      <div className="w-full max-w-md bg-[#0d0e12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-300 font-sans relative">
        {/* Absolute Glowing Lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500"></div>

        {/* Header Branding */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Minimalist Google Icon Logo */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-white font-semibold text-sm tracking-tight font-display">
              Google Accounts
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">OAuth 2.0 Gateway</span>
        </div>

        {/* Steps Rendering */}
        <div className="p-6">
          {step === "accounts" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white font-display">Sign in with Google</h3>
                <p className="text-xs text-zinc-400">to continue to <span className="text-indigo-400 font-semibold">Arena.ai Deploy</span></p>
              </div>

              {/* Accounts list */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => handleSelectAccount(defaultEmail)}
                  className="w-full p-3 bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition flex items-center gap-3 text-left group"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                    L
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-white block truncate">Linacre Projects (www.Linacre.site)</span>
                    <span className="text-[10px] text-zinc-500 block">Authorized active profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition" />
                </button>

                <div className="border-t border-zinc-900 my-3"></div>

                {/* Custom login form */}
                <form onSubmit={handleCustomAccountSubmit} className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                    Or sign in with custom account
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter other google email..."
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>

              <div className="pt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                <Shield className="h-3.5 w-3.5 text-zinc-600" />
                <span>Encrypted connection managed by Google Sandbox</span>
              </div>
            </div>
          )}

          {step === "consent" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <h3 className="text-sm font-bold text-white font-display">Arena.ai wants to access your Google Account</h3>
                <p className="text-[11px] text-zinc-400">{selectedEmail}</p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-3.5 space-y-3 text-xs">
                <span className="font-semibold text-zinc-300 block text-[11px] uppercase tracking-wider border-b border-zinc-900 pb-1.5">
                  Requested Permissions (Scopes):
                </span>

                {/* Scope 1 */}
                <div className="flex gap-2.5 items-start">
                  <div className="h-4 w-4 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-200 block">Personal Profile & Email</span>
                    <span className="text-[11px] text-zinc-500">Retrieve your Google email ({selectedEmail}) and display picture.</span>
                  </div>
                </div>

                {/* Scope 2 */}
                <div className="flex gap-2.5 items-start">
                  <div className="h-4 w-4 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-200 block">Google Drive Application Metadata</span>
                    <span className="text-[11px] text-zinc-500">Read and write encrypted backup assets within its own dedicated sandbox storage.</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 leading-normal bg-zinc-900/20 p-2.5 border border-zinc-900 rounded-lg">
                By clicking <span className="font-semibold text-zinc-300">Allow</span>, you trust Arena.ai with your developer configurations. You can revoke access at any time in your Google Settings.
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setStep("accounts")}
                  className="px-4 py-2 hover:bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-400 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConsentApproved}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  Allow & Authorize
                </button>
              </div>
            </div>
          )}

          {step === "handshake" && (
            <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fadeIn text-center">
              {isConnecting ? (
                <>
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <Lock className="h-4 w-4 text-white absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Exchanging Tokens</h3>
                    <p className="text-[11px] text-zinc-600 mt-1 font-mono">
                      POST /oauth2/v4/token HTTP/2
                    </p>
                  </div>
                  <div className="w-full max-w-[200px] bg-zinc-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full animate-progress" style={{ width: "100%" }}></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Google Login Successful</h3>
                    <p className="text-xs text-zinc-400 mt-1">Credentials stored in secure system storage.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
