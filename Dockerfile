FROM ubuntu:22.10

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROME_PATH=/usr/bin/google-chrome
ENV CHROMEDRIVER_SKIP_DOWNLOAD false
ENV NODE_VERSION v18.12.0
ENV NVM_DIR /usr/src/.nvm
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

# Update base image
RUN apt-get -qq update && \
  apt-get -qq dist-upgrade

# Accept Microsoft EULA agreement for ttf-mscorefonts-installer
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections

# Install dependencies for Chrome / Chromium
RUN apt-get -y -qq --no-install-recommends install \
  build-essential \
  ca-certificates \
  curl \
  dumb-init \
  ffmpeg \
  fontconfig \
  fonts-freefont-ttf \
  fonts-gfs-neohellenic \
  fonts-indic \
  fonts-ipafont-gothic \
  fonts-kacst \
  fonts-liberation \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  fonts-roboto \
  fonts-thai-tlwg \
  fonts-ubuntu \
  fonts-wqy-zenhei \
  gconf-service \
  git \
  libappindicator1 \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm-dev \
  libgbm1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libu2f-udev \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  locales \
  lsb-release \
  msttcorefonts \
  pdftk \
  unzip \
  wget \
  xdg-utils \
  xvfb

# Install nvm with node and npm
RUN mkdir -p $NVM_DIR &&\
  curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash &&\
  . $NVM_DIR/nvm.sh &&\
  nvm install $NODE_VERSION

# Cleanup
RUN fc-cache -f -v && \
  apt-get -qq clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN cd /tmp &&\
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb &&\
    dpkg -i --force-architecture  google-chrome-stable_current_amd64.deb;

# FROM public.ecr.aws/lambda/nodejs:14.2022.09.09.11
# Create working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install NPM dependencies for function
RUN npm install

# Copy handler function and tsconfig
COPY index.js ./

# Expose app
EXPOSE 3000

# Run app
CMD ["node", "index.js"]