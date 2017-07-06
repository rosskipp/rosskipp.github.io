---
layout: post
title: "Shot Blocking in the NHL Playoffs"
published: true
---

##### This post was published on the [yhat blog](http://blog.yhat.com/posts/hockey-shot-blocking.html)

# Shot Blocking in the NHL Playoffs

![]({{ site.baseurl }}/images/oshie-shot-block.png)

**About Ross:** Ross is a software guy at [Yhat](https://www.yhat.com/).  He used to work in NASCAR and generally likes sports.

### Introduction

Would you step in front of a six-ounce piece of hard rubber traveling at [100 miles per hour](https://www.youtube.com/watch?v=bWWsP-KhjiI)
wearing only a few pieces of soft foam and plastic for padding? Neither would I, but there are a bunch of crazy NHL hockey players who do exactly that,
night in and night out.

At this point in the NHL season, we’re well into the playoffs. That means that *some of us* have been watching hockey non-stop for the last few weeks
(there are two to four games per night in the early playoff rounds). During these contests, I'm amazed by how few shots get through to the net because
players willingly sacrifice their bodies and stand between the shooter and the goalie when an opponent fires the puck at the net.

As a casual observer, it seemed to me like shot blocking was more prevalent during playoff games than the regular season.
Intuitively, this would make sense since there is more on the line for each game, but I wanted to take a look at some data to see whether my suspicions were correct.


![]({{ site.baseurl }}/images/funny-shot-block.png)

### Getting the Data

Getting shot blocking data was more of a challenge than anticipated. The first website I checked,
[Hockey Reference](http://www.hockey-reference.com/) had regular season data, but nothing for the playoffs.
Most of the other sources I checked just didn't have anything in the way of shot blocking data.
Luckily, the [NHL stats site](http://www.nhl.com/stats/) came through (sort of).

They had data on shot blocking...but it's all shown in a javascript front end, which makes for a pleasant user experience but
 makes further analysis a pain (because the data tables get created on the fly). If you use the urllib package,
you'll notice that there are no data tables in the HTML, so we're going to use Selenium to run a browser instance and
process the data from there.

The first step was to `pip install selenium` and get the [chrome driver](http://chromedriver.storage.googleapis.com/index.html).

The following code will use a Selenium controlled browser to navigate to the url provided.

      from selenium import webdriver
      from bs4 import BeautifulSoup
      import pandas as pd
      import random, time

      # setup the chrome webdriver
      path_to_chromedriver = '/path/to/chromedriver'
      browser = webdriver.Chrome(executable_path = path_to_chromedriver)

Then getting a web page is as straightforward as this:

      url = 'http://thisisyoururl.com'
      browser.get(url)

From here, we loop through all seasons from 2006-present and pull the regular season cumulative shot blocks for teams that played in the playoffs that year.
To do this, I figured out how the site uses URL query parameters to indicate what data is being fetched (it's a pretty straightforward schema) so I could generate the desired URLs without using the front end.
Had the URL query parameters been harder to crack, we could have used Selenium to fill out the forms, check some boxes and hit buttons for us.

Alright, so now we've looped through all the pages we need and used BeautifulSoup to parse the HTML data tables to extract the cumulative shot blocking data for the regular
season and playoffs in addition to the number of games played. The data all gets saved to a Pandas dataframe. The code for this is on [my github](https://github.com/rkipp1210/data-projects/tree/master/hockey-shot-blocking) if you're interested. Here's what that dataframe looks like:

      df.head()

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>season</th>
      <th>team</th>
      <th>numGamesPlayoffs</th>
      <th>numBlocksPlayoffs</th>
      <th>numGamesRegular</th>
      <th>numBlocksRegular</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>20062007</td>
      <td>1</td>
      <td>11</td>
      <td>172</td>
      <td>82</td>
      <td>1127</td>
    </tr>
    <tr>
      <th>1</th>
      <td>20062007</td>
      <td>2</td>
      <td>5</td>
      <td>91</td>
      <td>82</td>
      <td>1307</td>
    </tr>
    <tr>
      <th>2</th>
      <td>20062007</td>
      <td>3</td>
      <td>10</td>
      <td>159</td>
      <td>82</td>
      <td>1386</td>
    </tr>
    <tr>
      <th>3</th>
      <td>20062007</td>
      <td>5</td>
      <td>5</td>
      <td>88</td>
      <td>82</td>
      <td>1238</td>
    </tr>
    <tr>
      <th>4</th>
      <td>20062007</td>
      <td>7</td>
      <td>16</td>
      <td>290</td>
      <td>82</td>
      <td>1248</td>
    </tr>
  </tbody>
</table>

The data looks good - now it's time for some serious analysis!

![]({{ site.baseurl }}/images/shot-block-big-data.jpg)

### Some Serious Analysis

We'll need to [normalize](http://blog.yhat.com/posts/data-normalization-in-python.html) this data so we can investigate across the different number of games in the regular season and the playoffs,
and compare between the various teams that play a different number of games in the playoffs. To do this, we'll take the total of all the shot blocks in the regular season or playoffs
and divide by the number of games in which those blocks were accumulated to get shot blocks per game. That looks like this:

      df['blkPerGmRegular'] = df.numBlocksRegular / df.numGamesRegular
      df['blkPerGmPlayoff'] = df.numBlocksPlayoffs / df.numGamesPlayoffs
      # take the difference between regular season and playoffs
      df['blkDiff'] = df.blkPerGmPlayoff - df.blkPerGmRegular
      # see what we've done
      df.head()

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>season</th>
      <th>team</th>
      <th>numGamesPlayoffs</th>
      <th>numBlocksPlayoffs</th>
      <th>numGamesRegular</th>
      <th>numBlocksRegular</th>
      <th>blkPerGmRegular</th>
      <th>blkPerGmPlayoff</th>
      <th>blkDiff</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>20062007</td>
      <td>1</td>
      <td>11</td>
      <td>172</td>
      <td>82</td>
      <td>1127</td>
      <td>13.743902</td>
      <td>15.636364</td>
      <td>1.892461</td>
    </tr>
    <tr>
      <th>1</th>
      <td>20062007</td>
      <td>2</td>
      <td>5</td>
      <td>91</td>
      <td>82</td>
      <td>1307</td>
      <td>15.939024</td>
      <td>18.200000</td>
      <td>2.260976</td>
    </tr>
    <tr>
      <th>2</th>
      <td>20062007</td>
      <td>3</td>
      <td>10</td>
      <td>159</td>
      <td>82</td>
      <td>1386</td>
      <td>16.902439</td>
      <td>15.900000</td>
      <td>-1.002439</td>
    </tr>
    <tr>
      <th>3</th>
      <td>20062007</td>
      <td>5</td>
      <td>5</td>
      <td>88</td>
      <td>82</td>
      <td>1238</td>
      <td>15.097561</td>
      <td>17.600000</td>
      <td>2.502439</td>
    </tr>
    <tr>
      <th>4</th>
      <td>20062007</td>
      <td>7</td>
      <td>16</td>
      <td>290</td>
      <td>82</td>
      <td>1248</td>
      <td>15.219512</td>
      <td>18.125000</td>
      <td>2.905488</td>
    </tr>
  </tbody>
</table>

[Plotly](https://plot.ly/) makes beautiful plots, which happen to look great in blog posts, so here's
the code to generate histograms of the regular season and playoff data.

      # Plot the regular season and playoff data separately
      trace1 = go.Histogram(
          x = df.blkPerGmRegular,
          opacity = 0.66,
          name = 'Regluar Season',
          marker = dict(
              line = dict(
                  color = 'grey',
                  width = 1.0
              )
          )
      )
      trace2 = go.Histogram(
          x = df.blkPerGmPlayoff,
          opacity = 0.66,
          name = 'Playoffs',
          marker = dict(
              line = dict(
                  color = 'grey',
                  width = 1.0
              )
          )
      )
      data = [trace1, trace2]
      layout = dict(
          title = '2006-2015 NHL Shot Blocks Per Game For Playoff Teams',
          yaxis = dict(title = '%'),
          xaxis = dict(title = 'Shot Blocks per Game (Cumulative Shot Blocks / Games Played)'),
          bargap = 0.25
          barmode='overlay'
      )
      fig=dict(data=data, layout=layout)
      plotly.offline.plot(fig)


The code will save a local HTML file that you can view before uploading it to the plot.ly website for viewing/sharing/editing.
You can also upload directly in the code. Take a look at what we've produced.

<iframe width="900" height="500" frameborder="0" scrolling="no" src="https://plot.ly/~coristig/31.embed"></iframe>


Woo! It seems like we're getting somewhere. Let's look at the distribution of the difference between the regular season data and the playoffs
for each of these team seasons. It's pretty much the same code, just with `df.blkDiff` as the x variable.

<iframe width="900" height="500" frameborder="0" scrolling="no" src="https://plot.ly/~coristig/32.embed"></iframe>

Looking at this last plot, you might say that there is a slight increase in shot blocks during the playoffs compared to the regular season.
Those two seasons out on the right are the 2014-2015 Nashville Predators and the 2015-2016 Minnesota Wild. You can order the dataframe with this:

      df_ordered = df.sort_values(by='blkDiff', ascending=False)


Maybe we should let some statistical techniques tell us if the difference is significant.

### Super Simple Statistics

![]({{ site.baseurl }}/images/shot-block-stats-meme.jpg)

Better test if this distribution can be treated as normal first, then do a 1 sample t-test with the null hypothesis being that the mean is equal to zero and see what shakes out:

      print stats.normaltest(df.blkDiff)
      > NormaltestResult(statistic=5.8671079764564249, pvalue=0.053207602525582813
      # Success! - The p > 0.05 so she's probably normal according to this test
      print stats.ttest_1samp(df.blkDiff, 0.0)
      > Ttest_1sampResult(statistic=9.7830178032344772, pvalue=5.7654455833651475e-18)

I'm not a stats guy, but I'm pretty sure this means that we reject the null hypothesis that the sample average is centered around zero shot block difference per game.

### Parting Thoughts

The most difficult part of this analysis was by far the data collection. I had a hunch that there would be an increase in shot blocking in the
playoffs compared to the same team during the regular season, and it does appear that there is a slight increase.

As an aside, we could also look at questions like, "does shot blocking look like it changes over the course of the last decade"? Here's the code to make some boxplots
for the regular season shot block data for each season.

      seasons = [ 20062007, 20072008, 20082009, 20092010, 20102011, \
                  20112012, 20122013, 20132014, 20142015, 20152016 ]
      data = []
      for seasonInt in seasons:
          trace = go.Box(
              y = df.blkPerGmRegular[df.season==seasonInt],
              name = str(seasonInt)[:4] + ' - ' + str(seasonInt)[4:],
              boxpoints = 'all',
              jitter=0.3,
          )
          data.append(trace)
      layout = go.Layout(
          title = "2006-2015 NHL Regular Season Shot Blocks Per Game For Playoff Teams in Each Season",
          showlegend = False,
          yaxis = dict(title = 'Shot Blocks Per Game'),
          xaxis = dict(
              title = 'Season',
              tickangle = -45
          ),
      )
      fig = dict(data = data, layout = layout)
      plotly.offline.plot(fig)

<iframe width="900" height="500" frameborder="0" scrolling="no" src="https://plot.ly/~coristig/34.embed"></iframe>

<br>
Interestingly, we see a relative dip in shot blocks during the 2007-2008 regular season!

### What Next?

There are plenty of other questions we could explore with this data. Here are a few I've thought about:

  - How much spread is there in the game to game data vs. the season aggregate as we looked at here?
  - Does this data have trends within a season such as more blocks leading to the playoffs?
  - Does blocking more shots correlate to more success?
