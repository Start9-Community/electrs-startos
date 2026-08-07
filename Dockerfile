FROM rust:1.91.1-slim-trixie AS builder

RUN apt update -qqy
RUN apt upgrade -qqy
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    clang \
    cmake \
    libclang-dev \
    librocksdb-dev \
    patch
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

WORKDIR /build
COPY ./electrs .
# Upstream deltas we carry — see patches/README.md for what each one is and the
# condition that retires it. --fuzz=0 so a submodule bump that changes the context
# fails the build loudly instead of applying somewhere subtly wrong.
COPY ./patches ./patches
RUN set -e; for p in ./patches/*.patch; do [ -e "$p" ] || continue; echo "applying $p"; patch -p1 --fuzz=0 <"$p"; done
ENV ROCKSDB_INCLUDE_DIR=/usr/include
ENV ROCKSDB_LIB_DIR=/usr/lib
RUN rustup toolchain install stable
RUN cargo +stable install --locked --path .

FROM debian:trixie-slim AS final

RUN apt update -qqy
RUN apt upgrade -qqy
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    bash \
    curl \
    ca-certificates \
    librocksdb9.10
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ARG TARGETARCH
RUN curl -sL https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${TARGETARCH} \
    -o /usr/local/bin/yq && chmod +x /usr/local/bin/yq

COPY --from=builder /usr/local/cargo/bin/electrs /bin/electrs

WORKDIR /data

STOPSIGNAL SIGINT
