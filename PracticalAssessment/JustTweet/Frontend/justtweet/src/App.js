import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import React from "react";
import NavbarComponent from "./components/navbar";
import HomePage from "./homepage";
import ProfileStats from "./components/profilestats";
import ProfileInfo from "./components/profileinfo";
import ProfileCover from "./components/profilecover";
import NewTweet from "./components/newtweet";
import TweetCard from "./components/tweetcard";
import InvididualTweetCard from "./components/invididualtweetcard";
import RightPanel from "./components/rightpanel";

function App() {
  return (
    <React.Fragment>
      <NavbarComponent />
      <Container fluid>
        <div className="content">
          <Routes>
            <Route path="/profilecover" element={<ProfileCover />} />
            <Route path="/profilestats" element={<ProfileStats />} />
            <Route path="/profileinfo" element={<ProfileInfo />} />
            <Route path="/newtweet" element={<NewTweet />} />
            <Route path="/tweetcard" element={<TweetCard />} />
            <Route
              path="/invididualtweetcard"
              element={<InvididualTweetCard />}
            />
            <Route path="/rightpanel" element={<RightPanel />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default App;
