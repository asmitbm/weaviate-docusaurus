import React from "react";
import style from "../../css/podcast/podcast_card.module.css"

export default function PodcastCard(props) {
    
    return (
        <div class={style.podcast_card}>
            <a href={`https://www.youtube.com/watch?v=${props.youtube}`} target="_blank">
            <img src={props.cover_image} />
            <div>
                <h2>{props.title}</h2>
                <p>{props.description}</p>
                <a href="#" class="read-more">{props.date}</a>
            </div>
            </a>
        </div>
    )
}