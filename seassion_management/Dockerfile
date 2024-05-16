FROM node

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

# Create a shell script to run both commands
RUN echo -e '#!/bin/bash\nnpm run watch & npm run dev' > start.sh
RUN chmod +x start.sh

# Run the shell script as the CMD
CMD ["./start.sh"]

EXPOSE 8001
