import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Query your data using GraphQL',
    Svg: require('@site/static/img/graphql.svg').default,
    description: (
      <>
        Weaviate has a graph-like data model to easily search through your data using the GraphQL-API. 
        Making Weaviate ideal to store any vectorized data format or graph-embeddings.
      </>
    ),
  },
  {
    title: 'Containerized development',
    Svg: require('@site/static/img/docker.svg').default,
    description: (
      <>
        Starting your development with Weaviate is one <code>docker-compose up</code> away. 
        Get started in the docs <a href="/docs/">here</a>.
      </>
    ),
  },
  {
    title: 'Kubernetes for scale',
    Svg: require('@site/static/img/kubernetes.svg').default,
    description: (
      <>
        Need to scale for production? Check out the Weaviate K8s docs <a href="https://weaviate.io/developers/weaviate/current/getting-started/installation.html#kubernetes" target="_blank">here</a>.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h1>Combining developer UX and scalability</h1>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
