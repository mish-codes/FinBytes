---
layout: page
title: Demo
icon: fas fa-play-circle
order: 8
---

<style>
.demo-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  border: 1px solid var(--border-color, #e8e8e8);
  border-radius: 8px;
  overflow: hidden;
  background: var(--card-bg, #fff);
}
.demo-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.demo-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 0.85rem;
  color: var(--text-muted-color, #999);
  border-bottom: 1px solid var(--border-color, #e8e8e8);
  background: var(--card-bg, #f8f8f8);
}
.demo-bar a {
  color: var(--link-color, #2a7ae2);
  text-decoration: none;
  font-size: 0.85rem;
}
.demo-bar a:hover { text-decoration: underline; }
</style>

<div class="demo-bar">
  <span>Stock Risk Scanner &mdash; live on Streamlit Cloud</span>
  <a href="https://finbytes.streamlit.app" target="_blank">Open in new tab &#8599;</a>
</div>
<div class="demo-container">
  <iframe src="https://finbytes.streamlit.app/?embedded=true" allow="clipboard-write"></iframe>
</div>
