import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Music, Loader2, RefreshCcw, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"
import Navbar from "../components/profile/NavBar"
import BottomNav from "../components/homepage/BottomNav"
import { useUserDistributionRequest } from "../../Hooks/distribution/useUserDistributionRequest"

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "Not specified"
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (value) => {
  if (!value) return "Date unavailable"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const statusBadge = (label, isActive, activeColor) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
      isActive ? activeColor : "bg-gray-700 text-gray-300"
    }`}
  >
    {isActive ? <CheckCircle size={12} /> : null}
    {label}
  </span>
)

const UserDistributionRequests = () => {
  const navigate = useNavigate()
  const {
    fetchDistributionRequests,
    requests,
    isLoadingRequests,
    error,
  } = useUserDistributionRequest()

  useEffect(() => {
    fetchDistributionRequests()
  }, [fetchDistributionRequests])

  const handleRefresh = () => {
    fetchDistributionRequests()
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-24">
      <Navbar name="distribution" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <h1 className="mt-2 text-2xl font-semibold flex items-center gap-2">
              <Music className="text-[#2D8C72]" size={22} />
              My Distribution Requests
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Track every submission and its review status in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <RefreshCcw size={14} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/distribution")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2D8C72] px-4 py-2 text-sm font-semibold text-white hover:bg-[#34A085] transition-colors"
            >
              New Request
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error.message || "Failed to load distribution requests."}
          </div>
        )}

        <div className="mt-6">
          {isLoadingRequests ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 py-16">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#2D8C72]" />
              <p className="text-sm text-gray-400">Fetching your submissions...</p>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-5">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-3xl border border-gray-800 bg-[#151515] p-5 md:p-6 shadow-lg shadow-black/20"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">Caption</p>
                      <h2 className="text-2xl font-semibold">{request.caption || "Untitled release"}</h2>
                      <p className="mt-1 text-sm text-gray-400">
                        {request.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusBadge(request.paid ? "Paid" : "Awaiting Payment", request.paid, "bg-emerald-500/20 text-emerald-300")}
                      {statusBadge(request.read ? "Reviewed" : "Pending Review", request.read, "bg-blue-500/20 text-blue-300")}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4">
                      <p className="text-xs uppercase text-gray-500 tracking-widest mb-1">Genre</p>
                      <p className="text-lg font-semibold text-white">{request.genre || "N/A"}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4">
                      <p className="text-xs uppercase text-gray-500 tracking-widest mb-1">Amount</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(request.amount)}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4">
                      <p className="text-xs uppercase text-gray-500 tracking-widest mb-1">Submitted</p>
                      <p className="text-lg font-semibold text-white">{formatDate(request.created_at)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Streaming Links</p>
                    <div className="flex flex-wrap gap-2">
                      {request.social_links
                        ? Object.entries(request.social_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-200 hover:border-[#2D8C72] hover:text-white transition-colors"
                            >
                              <ExternalLink size={12} />
                              {platform.replace("_", " ")}
                            </a>
                          ))
                        : (
                          <span className="text-sm text-gray-500">No links provided.</span>
                        )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
                    {request.cover_photo && (
                      <a
                        href={request.cover_photo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-gray-300 hover:text-white"
                      >
                        <ExternalLink size={14} />
                        Cover art
                      </a>
                    )}
                    {request.audio_upload && (
                      <a
                        href={request.audio_upload}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-gray-300 hover:text-white"
                      >
                        <ExternalLink size={14} />
                        Audio file
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-[#151515] p-8 text-center">
              <p className="text-lg font-semibold text-white">No distribution requests yet</p>
              <p className="mt-2 text-sm text-gray-400">
                Submit your first project to start tracking it here.
              </p>
              <button
                onClick={() => navigate("/distribution")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2D8C72] px-4 py-2 text-sm font-semibold text-white hover:bg-[#34A085] transition-colors"
              >
                Start a request
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default UserDistributionRequests

