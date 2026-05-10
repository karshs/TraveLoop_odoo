import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicTrip, copyPublicTrip } from "../api/shared.api";
import { Copy, MapPin } from "lucide-react";
import styles from "../styles/PublicTripPage.module.scss";

export default function PublicTripPage() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await getPublicTrip(shareToken!);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [shareToken]);

  const handleCopyTrip = async () => {
    setCopying(true);
    try {
      await copyPublicTrip(shareToken!);
      alert("Trip copied successfully!");
      navigate("/trips");
    } catch (err) {
      console.error(err);
      alert("Failed to copy trip. Ensure you are logged in.");
    } finally {
      setCopying(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copied to clipboard!");
  };

  if (loading) return <div className={styles.loading}>Loading trip...</div>;

  if (error || !trip) {
    return (
      <div className={styles.errorContainer}>
        <h2>This trip is private or doesn't exist</h2>
        <button onClick={() => navigate("/")} className={styles.backBtn}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.shareBar}>
        <span className={styles.url}>{window.location.href}</span>
        <button onClick={handleCopyUrl} className={styles.copyUrlBtn}>
          <Copy size={16} /> Copy Link
        </button>
      </div>

      <header className={styles.hero}>
        <h1>{trip.title}</h1>
        <p className={styles.description}>{trip.description}</p>
        <div className={styles.meta}>
          {trip.start_date && <span>From: {new Date(trip.start_date).toLocaleDateString()}</span>}
          {trip.end_date && <span>To: {new Date(trip.end_date).toLocaleDateString()}</span>}
        </div>
        <div className={styles.author}>
          Created by {trip.user.firstName} {trip.user.lastName}
        </div>
      </header>

      <div className={styles.stopsSection}>
        <h2>Itinerary</h2>
        {trip.stops.map((stop: any) => (
          <div key={stop.id} className={styles.stopCard}>
            <div className={styles.stopHeader}>
              <MapPin className={styles.mapIcon} />
              <h3>{stop.city.name} <span>{stop.city.country}</span></h3>
              <div className={styles.stopDates}>
                {stop.arrival_date && new Date(stop.arrival_date).toLocaleDateString()}
                {stop.departure_date && ` - ${new Date(stop.departure_date).toLocaleDateString()}`}
              </div>
            </div>
            
            {stop.stop_activities && stop.stop_activities.length > 0 && (
              <div className={styles.activitiesList}>
                {stop.stop_activities.map((sa: any) => (
                  <div key={sa.id} className={styles.activityItem}>
                    <span className={styles.activityName}>{sa.activity.name}</span>
                    <span className={styles.costChip}>
                      ${sa.custom_cost || sa.activity.estimated_cost || 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actionBar}>
        <button onClick={handleCopyTrip} disabled={copying} className={styles.copyTripBtn}>
          <Copy size={20} />
          {copying ? "Copying..." : "Copy This Trip"}
        </button>
      </div>
    </div>
  );
}
