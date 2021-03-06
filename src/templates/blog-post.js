import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const img = post.frontmatter.coverImage?.childImageSharp?.fluid
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article itemScope itemType="http://schema.org/Article">
        <header>
          {img && (
            <div style={{ marginTop: "2rem" }}>
              <Img fluid={img} />
            </div>
          )}
          <h1 itemProp="headline" style={{ marginTop: 40 }}>
            {post.frontmatter.title}
          </h1>
          {post.frontmatter.date && (
            <p style={{ marginTop: "1rem", color: "var(--color-secondary)" }}>
              {post.frontmatter.date}
            </p>
          )}
        </header>
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
      <nav style={{ marginTop: 30 }}>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            padding: 0,
            margin: 0,
            listStyle: `none`,
          }}
        >
          <li style={{ listStyle: "none" }}>
            {previous && (
              <Link
                to={previous.fields.slug}
                rel="prev"
                style={{ textDecoration: "none" }}
              >
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li style={{ listStyle: "none" }}>
            {next && (
              <Link
                to={next.fields.slug}
                rel="next"
                style={{ textDecoration: "none" }}
              >
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
        coverImage {
          name
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
