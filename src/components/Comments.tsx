import { useState } from "react";
import type React from "react";
import {
  deleteComment,
  deleteReply,
  postComment,
  postReply,
  toggleCommentLike,
  toggleReplyLike,
  useComments,
  useReplies,
  useUser,
} from "../lib/store";
import type { AuthUser, CommentEntry, ReplyEntry } from "../lib/types";
import { cn } from "../utils/cn";
import { formatCount, formatRelativeTime, Icon } from "./ui";
import AuthModal from "./AuthModal";

/* ---------------- spoiler-blurred text ---------------- */
function SpoilerText({ text, className }: { text: string; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) {
    return <p className={cn("whitespace-pre-wrap break-words leading-relaxed text-zinc-400", className)}>{text}</p>;
  }
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="group/spoiler relative block w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 py-2 text-left"
    >
      <p className={cn("select-none whitespace-pre-wrap break-words px-3 leading-relaxed text-zinc-400 blur-sm", className)}>{text}</p>
      <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-xs font-semibold text-zinc-200 backdrop-blur-[1px] transition group-hover/spoiler:bg-black/55">
        <Icon.EyeOff className="h-3.5 w-3.5" /> Spoiler — click to view
      </span>
    </button>
  );
}

/* ---------------- shared composer (top-level comment or reply) ---------------- */
function ComposerBox({
  avatarUrl,
  placeholder,
  onSubmit,
  onCancel,
  autoFocus,
}: {
  avatarUrl?: string | null;
  placeholder: string;
  onSubmit: (text: string, spoiler: boolean) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [posting, setPosting] = useState(false);

  async function submit() {
    if (!text.trim() || posting) return;
    setPosting(true);
    await onSubmit(text, spoiler);
    setPosting(false);
    setText("");
    setSpoiler(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter posts; Shift+Enter inserts a newline instead.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-start gap-3"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
        {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <Icon.User className="h-4 w-4 text-zinc-500" />}
      </div>
      <div className="flex-1 space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          maxLength={1000}
          autoFocus={autoFocus}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60 focus:bg-white/10"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-zinc-500">
            <input
              type="checkbox"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-red-600"
            />
            Mark as spoiler
          </label>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button type="button" onClick={onCancel} className="rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!text.trim() || posting}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-40"
            >
              {posting ? <Icon.Loader className="h-3.5 w-3.5 animate-spin" /> : <Icon.Send className="h-3.5 w-3.5" />}
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ---------------- reply ---------------- */
function ReplyItem({
  animeId,
  episode,
  commentId,
  reply,
  currentUser,
  onRequireAuth,
}: {
  animeId: number;
  episode?: number;
  commentId: string;
  reply: ReplyEntry;
  currentUser: AuthUser | null;
  onRequireAuth: () => void;
}) {
  const liked = !!currentUser && (reply.likedBy || []).includes(currentUser.uid);
  const likeCount = (reply.likedBy || []).length;

  async function handleLike() {
    const result = await toggleReplyLike(animeId, commentId, reply.id, reply.likedBy, episode);
    if (result.requiresAuth) onRequireAuth();
  }

  async function handleDelete() {
    await deleteReply(animeId, commentId, reply.id, episode);
  }

  return (
    <div className="group/reply flex items-start gap-2.5">
      <div className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
        {reply.photoURL ? <img src={reply.photoURL} alt={reply.name} className="h-full w-full object-cover" /> : <Icon.User className="h-3.5 w-3.5 text-zinc-500" />}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-zinc-200">{reply.name}</p>
          <span className="text-[10px] text-zinc-600">{formatRelativeTime(reply.createdAt)}</span>
        </div>

        {reply.spoiler ? (
          <SpoilerText text={reply.text} className="text-xs" />
        ) : (
          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-400">{reply.text}</p>
        )}

        <div className="flex items-center gap-3 pt-0.5">
          <button
            onClick={handleLike}
            className={cn("inline-flex items-center gap-1 text-[11px] font-medium transition", liked ? "text-red-400" : "text-zinc-500 hover:text-white")}
          >
            <Icon.ThumbsUp className="h-3 w-3" />
            {likeCount > 0 ? formatCount(likeCount) : "Like"}
          </button>
          {currentUser?.uid === reply.uid && (
            <button onClick={handleDelete} className="text-zinc-600 opacity-0 transition hover:text-red-400 group-hover/reply:opacity-100">
              <Icon.Trash className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- top-level comment ---------------- */
function CommentItem({
  animeId,
  episode,
  comment,
  currentUser,
  onRequireAuth,
}: {
  animeId: number;
  episode?: number;
  comment: CommentEntry;
  currentUser: AuthUser | null;
  onRequireAuth: () => void;
}) {
  const replies = useReplies(animeId, comment.id, episode);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const liked = !!currentUser && (comment.likedBy || []).includes(currentUser.uid);
  const likeCount = (comment.likedBy || []).length;

  async function handleLike() {
    const result = await toggleCommentLike(animeId, comment.id, comment.likedBy, episode);
    if (result.requiresAuth) onRequireAuth();
  }

  async function handleDelete() {
    await deleteComment(animeId, comment.id, episode);
  }

  async function submitReply(text: string, spoiler: boolean) {
    const result = await postReply(animeId, comment.id, text, episode, spoiler);
    if (result.requiresAuth) {
      onRequireAuth();
      return;
    }
    setShowReplyBox(false);
    setShowReplies(true);
  }

  return (
    <div className="group/comment flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
        {comment.photoURL ? <img src={comment.photoURL} alt={comment.name} className="h-full w-full object-cover" /> : <Icon.User className="h-4 w-4 text-zinc-500" />}
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-zinc-200">{comment.name}</p>
          <span className="text-[11px] text-zinc-600">{formatRelativeTime(comment.createdAt)}</span>
        </div>

        {comment.spoiler ? (
          <SpoilerText text={comment.text} />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-400">{comment.text}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-0.5">
          <button
            onClick={handleLike}
            className={cn("inline-flex items-center gap-1.5 text-xs font-medium transition", liked ? "text-red-400" : "text-zinc-500 hover:text-white")}
          >
            <Icon.ThumbsUp className="h-3.5 w-3.5" />
            {likeCount > 0 ? formatCount(likeCount) : "Like"}
          </button>
          <button onClick={() => setShowReplyBox((v) => !v)} className="text-xs font-medium text-zinc-500 transition hover:text-white">
            Reply
          </button>
          {replies.length > 0 && (
            <button onClick={() => setShowReplies((v) => !v)} className="text-xs font-medium text-zinc-500 transition hover:text-white">
              {showReplies ? "Hide" : "View"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
          {currentUser?.uid === comment.uid && (
            <button onClick={handleDelete} className="text-zinc-600 opacity-0 transition hover:text-red-400 group-hover/comment:opacity-100">
              <Icon.Trash className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showReplyBox && (
          <div className="pt-2">
            <ComposerBox
              avatarUrl={currentUser?.photoURL}
              placeholder={`Reply to ${comment.name}...`}
              onSubmit={submitReply}
              onCancel={() => setShowReplyBox(false)}
              autoFocus
            />
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="space-y-4 border-l border-white/10 pl-4 pt-3">
            {replies.map((r) => (
              <ReplyItem
                key={r.id}
                animeId={animeId}
                episode={episode}
                commentId={comment.id}
                reply={r}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- root ---------------- */
export default function Comments({ animeId, episode }: { animeId: number; episode?: number }) {
  const comments = useComments(animeId, episode);
  const user = useUser();
  const [showAuth, setShowAuth] = useState(false);

  async function handleTopLevelSubmit(text: string, spoiler: boolean) {
    const result = await postComment(animeId, text, episode, spoiler);
    if (result.requiresAuth) setShowAuth(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Comments</h2>
        <span className="text-sm text-zinc-500">{comments.length}</span>
      </div>

      {user ? (
        <ComposerBox
          avatarUrl={user.photoURL}
          placeholder={episode ? "Share your thoughts on this episode..." : "Share your thoughts about this anime..."}
          onSubmit={handleTopLevelSubmit}
        />
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm text-zinc-400">Sign in to join the discussion.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="shrink-0 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
          >
            Sign In
          </button>
        </div>
      )}

      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-600">No comments yet — be the first to say something.</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              animeId={animeId}
              episode={episode}
              comment={c}
              currentUser={user}
              onRequireAuth={() => setShowAuth(true)}
            />
          ))
        )}
      </div>

      {showAuth && <AuthModal mode="signin" onClose={() => setShowAuth(false)} />}
    </div>
  );
}