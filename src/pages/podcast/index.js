import React from 'react';
import Layout from '@theme/Layout';
import style from "../../css/podcast/podcast_page.module.css"
import PodcastCard from '../../components/podcast_card';
import PodcastData from '../../../podcast/podcast'

export default function Podcast() {
  
  const card = PodcastData.map((item, index) => {
    return (
      <PodcastCard
          key = {index}
          title={item.title}
          description={item.description}
          cover_image={item.cover_image}
          youtube={item.youtube}
          date={item.date}
      />
    )
  })
  
  return (
    <Layout title="Podcast" description="Hello React Page">
      <div className={style.podcast}>
        <div className={style.podcast_page_heading}>
          <h1>Weaviate Podcast</h1>
        </div>
        <p>Join Connor Shorten when he interviews Weaviate community users, leading machine learning experts, and explores Weaviate use cases from users and customers.</p>
        <a className={style.subscribe_button} href="https://www.youtube.com/playlist?list=PLTL2JUbrY6tW-KOQfOek8dtUmPgGQj3F0" target="_blank">Subscribe to the YouTube channel</a>
      </div>
      <div className={style.podcast_container}>
        <div className={style.podcast_container_group}>
          {card}
        </div>
      </div>
    </Layout>
  );
}