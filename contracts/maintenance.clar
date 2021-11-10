
;; ui-settings
;; Enables a site deployed with static export to receive ui messages
;; to specific versions, identified by short commitHash
;; Useful if versions of a site need to be put into maintenance mode
(define-constant AVICULTURIST tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401)) ;; unauthorized
(define-constant ERR_NOT_FOUND (err u404))      ;; not found
(define-constant ERR_FOUND (err u500))          ;; cannot duplicate entries

(define-map maintenanceMode
  {commitHash: (string-ascii 7)}
  {
    maintenance: bool,        ;; whether the site is in maintenance mode
    wall: (string-ascii 280)  ;; (write to all) displays the message to this version of the site
  }
)
(define-read-only (getMaintenanceMode (commitHash (string-ascii 7)))
    (map-get? maintenanceMode {commitHash: commitHash}))

(define-public (addMaintenanceMode (commitHash (string-ascii 7)) (maintenance bool) (wall (string-ascii 280)))
  (begin
    (asserts! (is-eq contract-caller AVICULTURIST) (err ERR_NOT_AUTHORIZED))
    (asserts! (is-none (map-get? maintenanceMode {commitHash: commitHash})) (err ERR_FOUND))
    (map-set maintenanceMode {commitHash: commitHash}
      {
        maintenance: maintenance,
        wall: wall
      })
    (ok u0))
)

(define-public (setMaintenance (commitHash (string-ascii 7)) (maintenance bool))
  (let
    (
      (mode (unwrap! (map-get? maintenanceMode {commitHash: commitHash}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-eq contract-caller AVICULTURIST) (err ERR_NOT_AUTHORIZED))
    (begin
      (map-set maintenanceMode {commitHash: commitHash}
        (merge mode { maintenance: maintenance })
      )
      (ok block-height)
    )
  )
)

(define-public (setWall (commitHash (string-ascii 7)) (wall (string-ascii 280)))
  (let
    (
      (mode (unwrap! (map-get? maintenanceMode {commitHash: commitHash}) (err ERR_NOT_FOUND)))
    )
    (asserts! (is-eq contract-caller AVICULTURIST) (err ERR_NOT_AUTHORIZED))
    (begin
      (map-set maintenanceMode {commitHash: commitHash}
        (merge mode { wall: wall })
      )
      (ok block-height)
    )
  )
)
