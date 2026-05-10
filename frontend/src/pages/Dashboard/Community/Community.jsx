import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import '../Shared.css';
import './Community.css';

const POSTS = [
  {
    initials: 'SR', name: 'Sara R.', time: '2h ago · Bali',
    color: 'rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.2)', textColor: 'rgba(255,215,0,0.7)',
    body: 'Just got back from 10 days in Ubud — the Campuhan Ridge Walk at sunrise is absolutely unreal. Beat the crowds by going at 5:45am. Anyone needs a guide rec, DM me!',
    likes: 48, comments: 12,
  },
  {
    initials: 'MK', name: 'Mike K.', time: '5h ago · Japan',
    color: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.2)', textColor: 'rgba(167,139,250,0.8)',
    body: 'Kyoto in November is peak foliage season — Arashiyama and Fushimi Inari are mind-blowing. Pro tip: buy the JR Pass before you land, saves ~$80.',
    likes: 91, comments: 24,
  },
  {
    initials: 'LT', name: 'Leila T.', time: '1d ago · France',
    color: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.18)', textColor: 'rgba(52,211,153,0.75)',
    body: 'Paris in September is *chef\'s kiss*. Skip the Eiffel Tower queue — go to Montparnasse Tower instead for the best view of it. Fewer tourists, half the price.',
    likes: 67, comments: 18,
  },
];

const TRENDING = [
  { emoji: '🌴', dest: 'Bali, Indonesia',   badge: '🔥 Hot',   badgeClass: 'upcoming' },
  { emoji: '🏔️', dest: 'Kyoto, Japan',      badge: 'Trending', badgeClass: 'upcoming' },
  { emoji: '🏛️', dest: 'Rome, Italy',       badge: 'Rising',   badgeClass: 'planning' },
  { emoji: '🌊', dest: 'Maldives',          badge: 'Rising',   badgeClass: 'planning' },
];

function PostCard({ post }) {
  const [liked, setLiked]       = useState(false);
  const [likes, setLikes]       = useState(post.likes);

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div
          className="post-avatar"
          style={{ background: post.color, borderColor: post.borderColor, color: post.textColor }}
        >
          {post.initials}
        </div>
        <div>
          <div className="post-user">{post.name}</div>
          <div className="post-time">{post.time}</div>
        </div>
      </div>
      <p className="post-body">{post.body}</p>
      <div className="post-actions">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={handleLike}>
          <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
          {likes}
        </button>
        <button className="post-action">
          <MessageCircle size={13} />
          {post.comments}
        </button>
        <button className="post-action">
          <Share2 size={13} />
          Share
        </button>
      </div>
    </div>
  );
}

function Community() {
  const [draft, setDraft] = useState('');

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Community</div>
        <div className="page-sub">Share tips, itineraries, and travel stories.</div>
      </div>

      <div className="card-grid grid-2">
        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {POSTS.map(p => <PostCard key={p.name} post={p} />)}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Trending */}
          <div className="card">
            <div className="section-row">
              <span className="section-title">Trending Destinations</span>
            </div>
            {TRENDING.map((t, i) => (
              <div
                key={t.dest}
                className="trending-row"
                style={i === TRENDING.length - 1 ? { borderBottom: 'none' } : {}}
              >
                <span style={{ fontSize: '1.1rem' }}>{t.emoji}</span>
                <span className="trending-dest">{t.dest}</span>
                <span className={`trip-tag ${t.badgeClass}`} style={{ fontSize: 10 }}>{t.badge}</span>
              </div>
            ))}
          </div>

          {/* Write a post */}
          <div className="card">
            <div className="section-row">
              <span className="section-title">Write a Post</span>
            </div>
            <textarea
              className="post-textarea"
              placeholder="Share a travel tip, recommendation, or story…"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={4}
            />
            <button
              className="btn-primary"
              style={{ marginTop: '0.65rem', height: 38, fontSize: '11.5px', padding: '0 1.25rem' }}
              onClick={() => { alert('Post submitted!'); setDraft(''); }}
              disabled={!draft.trim()}
            >
              Post →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;