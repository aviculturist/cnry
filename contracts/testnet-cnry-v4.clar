;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;    Cnry: A Warrant Canary Smart Contract.
;;     Running Bitcoin. Powered by Stacks.
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; References:
;; https://web.archive.org/web/20131103121048/http:/groups.yahoo.com/neo/groups/cypherpunks-lne-archive/conversations/topics/5869
;; https://www.eff.org/deeplinks/2014/04/warrant-canary-faq
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; SIP009 INTERFACE
(impl-trait .nft-trait.nft-trait)
(define-non-fungible-token CNRY uint)

;; CONSTANTS (UPPERCASE)
(define-constant AVICULTURIST tx-sender)
(define-constant DEFAULT_KEEPALIVE_EXPIRY u86400) ;; 1 day in seconds, see eff.org recommendations
;; errors
(define-constant ERR_NOT_AUTHORIZED (err u401)) ;; unauthorized
(define-constant ERR_NOT_FOUND (err u404)) ;; not found
(define-constant ERR_CNRY_EXISTS (err u409)) ;; conflict
(define-constant ERR_CNRY_EXPIRED (err u501)) ;; internal error
(define-constant ERR_COUNT (err u502)) ;; internal error
(define-constant ERR_CONTRACT_CALL (err u503)) ;; internal error

;; VARIABLES (lowercase)
(define-data-var base-uri (string-ascii 210) "https://cnry.org/?id={id}")
(define-data-var lastId uint u0)

;; STORAGE
(define-map cnrys
  {tokenId: uint}
  {
    index: uint,
    cnryName: (string-utf8 32),               ;; Name, e.g., Acme Corp.
    cnryStatement: (string-utf8 280),         ;; The published statement, e.g., Acme Corp has never received an order under Section 215 of the USA Patriot Act.
    cnryUri: (optional (string-ascii 210)),   ;; Uri, can be used for a logo, e.g., https://example.com/logo.png
    cnryProof: (optional (string-ascii 210)), ;; Social Proof link, e.g., https://twitter.com/acme/status/1453146247929123215
    cnryKeeper: principal,                    ;; The Cnry owner
    keepaliveExpiry: uint,                    ;; How long from `keepaliveTimestamp` until the Cnry expires. e.g., u31557600 (1 year in seconds)
    keepaliveTimestamp: uint,                 ;; Timestamp of the last keepalive
    hatchedTimestamp: uint                    ;; Cnry genesis timestamp
  }
)

(define-map watcher-count
  { tokenId: uint }
  { count: uint }
)

;;
;; CODE FOR SIP009 Start
;;
;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get lastId)))

;; SIP009: Get the token URI
(define-read-only (get-token-uri (tokenId uint))
  (match (map-get? cnrys {tokenId: tokenId})
    cnry
    (ok (some (default-to
      (var-get base-uri)
      (unwrap-panic (get cnryUri (map-get? cnrys {tokenId: tokenId}) ))
    )))
    ERR_NOT_FOUND
))

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (tokenId uint))
  (ok (nft-get-owner? CNRY tokenId)))

;; SIP009: Transfer token to a specified principal
;; DISABLED for testnet version
(define-public (transfer (tokenId uint) (sender principal) (recipient principal))
(err u500))
  ;; (if (and
  ;;       (is-eq tx-sender sender))
  ;;     (match (nft-transfer? CNRY tokenId sender recipient)
  ;;       success (ok success)
  ;;       error (err error))
  ;;     (err u500)))
;;
;; /CODE FOR SIP009 END
;;

;; PRIVATE
(define-private (is-owner (tokenId uint))
  (is-eq (some tx-sender) (nft-get-owner? CNRY tokenId)))

(define-private (get-time)
   (unwrap-panic (get-block-info? time (- block-height u1))))

(define-private (is-within-keepaliveExpiry (keepaliveTimestamp uint) (keepaliveExpiry uint) (tokenId uint))
  (> (to-int keepaliveTimestamp) (to-int (- (get-time) keepaliveExpiry))))

(define-private (get-base-uri (id uint))
  (var-get base-uri))

;; READ-ONLY

(define-read-only (get-watcher-count (tokenId uint))
  (ok (default-to { count: u0 } (map-get? watcher-count { tokenId: tokenId })))
)

;; TODO: wrap in ok()?
(define-read-only (get-metadata (tokenId uint))
    (map-get? cnrys {tokenId: tokenId}))

(define-read-only (is-alive (tokenId uint))
  (match (map-get? cnrys {tokenId: tokenId})
    cnry (ok (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId))
   ERR_NOT_FOUND
  )
)

(define-read-only (get-keepaliveExpiry (tokenId uint))
  (match (map-get? cnrys {tokenId: tokenId})
    cnry (ok (get keepaliveExpiry cnry))
    ERR_NOT_FOUND
  )
)

(define-read-only (get-keepaliveTimestamp (tokenId uint))
  (match (map-get? cnrys {tokenId: tokenId})
    cnry (ok (get keepaliveTimestamp cnry))
    ERR_NOT_FOUND
  )
)

;; PUBLIC

;; Set base uri
(define-public (set-base-uri (new-base-uri (string-ascii 210)))
  (begin
    (asserts! (is-eq tx-sender AVICULTURIST) ERR_NOT_AUTHORIZED)
    (var-set base-uri new-base-uri)
    (ok true)))

;; Hatch a Cnry
(define-public (hatch (cnryName (string-utf8 32) ) (cnryStatement (string-utf8 280)))
    (let ((nextId (+ u1 (var-get lastId))))
      (if (is-ok (nft-mint? CNRY nextId tx-sender))
        (begin
          (var-set lastId nextId)
          (map-set cnrys {tokenId: nextId}
          {
            index: nextId,
            cnryName: cnryName,
            cnryStatement: cnryStatement,
            cnryUri: none,
            cnryProof: none,
            cnryKeeper: tx-sender,
            keepaliveExpiry: DEFAULT_KEEPALIVE_EXPIRY,
            keepaliveTimestamp: (get-time),
            hatchedTimestamp: (get-time)
          })
          (print { index: nextId, cnryName: cnryName, cnryStatement: cnryStatement, cnryKeeper: tx-sender, keepaliveExpiry: DEFAULT_KEEPALIVE_EXPIRY, keepaliveTimestamp: (get-time), hatchedTimestamp: (get-time) })
          (ok nextId))
        ERR_CNRY_EXISTS)))

;; Keep the Cnry alive
(define-public (keepalive (tokenId uint))
  (let
    (
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
      (now (get-time) )
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { keepaliveTimestamp: now })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, keepaliveTimestamp: now })
      (ok block-height)
    )
  )
)

;; Update the Cnry name
(define-public (set-name (tokenId uint) (cnryName (string-utf8 32)))
  (let
    (
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { cnryName: cnryName })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, cnryName: cnryName })
      (ok block-height)
    )
  )
)

;; Update the Cnry statement
(define-public (set-statement (tokenId uint) (cnryStatement (string-utf8 280)))
  (let
    (
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { cnryStatement: cnryStatement })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, cnryStatement: cnryStatement })
      (ok block-height)
    )
  )
)

;; Update the Cnry keepalive expiry length
(define-public (set-keepaliveExpiry (tokenId uint) (keepaliveExpiry uint))
  (let
    (
      (now (get-time) )
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { keepaliveTimestamp: now }) ;; reset keepalive to now
      )
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { keepaliveExpiry: keepaliveExpiry })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, keepaliveExpiry: keepaliveExpiry })
      (ok block-height)
    )
  )
)

;; Update the Cnry uri
(define-public (set-uri (tokenId uint) (cnryUri (string-ascii 210)))
  (let
    (
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { cnryUri: (some cnryUri) })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, cnryUri: cnryUri })
      (ok block-height)
    )
  )
)

;; Update the Cnry proof
(define-public (set-proof (tokenId uint) (cnryProof (string-ascii 210)))
  (let
    (
      (cnry (unwrap! (map-get? cnrys {tokenId: tokenId}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-owner tokenId) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-within-keepaliveExpiry (get keepaliveTimestamp cnry) (get keepaliveExpiry cnry) tokenId) (err ERR_CNRY_EXPIRED) )
    (begin
      (map-set cnrys {tokenId: tokenId}
        (merge cnry { cnryProof: (some cnryProof) })
      )
      (print { index: tokenId, cnryKeeper: tx-sender, cnryProof: cnryProof })
      (ok block-height)
    )
  )
)

;; Watch a Cnry; mints a WATCHER token
(define-public (watch (tokenId uint))
  (begin
    (asserts! (>= (var-get lastId) tokenId) (err ERR_NOT_FOUND))
    (map-set watcher-count { tokenId: tokenId } {
      count: (+ u1 (get count (unwrap! (get-watcher-count tokenId) (err ERR_COUNT))))
    })
    (unwrap! (contract-call? .watcher-v4 watch-token "cnry-v4" tokenId tx-sender ) (err ERR_CONTRACT_CALL))
    (ok block-height)
  )
)

;; Migration to -v4
(define-constant ERR_MINT (err u504)) ;; internal error
(define-constant ERR_WATCHED_CONTRACT (err u505)) ;; internal error

(define-public (migrate-v4)
  (let
    (
      ;; TODO: testnet is indexed at 0
      (zero (unwrap! (contract-call? .cnry-v2 get-metadata u0) (err ERR_CONTRACT_CALL)) )
      (one (unwrap! (contract-call? .cnry-v2 get-metadata u1) (err ERR_CONTRACT_CALL)) )
      (two (unwrap! (contract-call? .cnry-v2 get-metadata u2) (err ERR_CONTRACT_CALL)) )
      (three (unwrap! (contract-call? .cnry-v2 get-metadata u3) (err ERR_CONTRACT_CALL)) )
      (four (unwrap! (contract-call? .cnry-v2 get-metadata u4) (err ERR_CONTRACT_CALL)) )
      (five (unwrap! (contract-call? .cnry-v2 get-metadata u5) (err ERR_CONTRACT_CALL)) )

    )
    ;; should prevent running more than once and check it's being run by deployer
    ;; but no-one is looking right now lol
    (begin
      ;; TODO: testnet is indexed at 0
      (unwrap! (nft-mint? CNRY u0 (get cnryKeeper zero)) (err ERR_MINT))
      (map-set cnrys {tokenId: u0}
        (merge zero { cnryProof: none })
      )

      (unwrap! (nft-mint? CNRY u1 (get cnryKeeper one)) (err ERR_MINT))
      (map-set cnrys {tokenId: u1}
        (merge one { cnryProof: none })
      )

      (unwrap! (nft-mint? CNRY u2 (get cnryKeeper two)) (err ERR_MINT))
      (map-set cnrys {tokenId: u2}
        (merge two { cnryProof: none })
      )

      (unwrap! (nft-mint? CNRY u3 (get cnryKeeper three)) (err ERR_MINT))
      (map-set cnrys {tokenId: u3}
        (merge three { cnryProof: none })
      )
      (unwrap! (nft-mint? CNRY u4 (get cnryKeeper four)) (err ERR_MINT))
      (map-set cnrys {tokenId: u4}
        (merge four { cnryProof: none })
      )
      (unwrap! (nft-mint? CNRY u5 (get cnryKeeper five)) (err ERR_MINT))
      (map-set cnrys {tokenId: u5}
        (merge five { cnryProof: none })
      )
      (var-set lastId u5)
      ;; Connects Cnry to new watcher contract
      (unwrap! (as-contract (contract-call? .watcher-v4 add-watched-contract))  (err ERR_WATCHED_CONTRACT))
      (ok block-height)
    )
  )
)
